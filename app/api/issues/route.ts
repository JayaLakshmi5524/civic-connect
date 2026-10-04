import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'])
const maxFileSize = 25 * 1024 * 1024

function clientForRequest(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: token ? { Authorization: `Bearer ${token}` } : {} } })
}

function departmentFor(category: string) {
  if (category === 'Water Supply') return 'Water Department'
  if (category === 'Garbage') return 'Sanitation'
  if (category === 'Streetlight' || category === 'Electricity') return 'Electrical'
  if (category === 'Road / Pothole') return 'Roads'
  return 'Municipality'
}

export async function POST(request: Request) {
  const supabase = clientForRequest(request)
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) return NextResponse.json({ error: 'Unable to verify the submission session.' }, { status: 401 })
  const form = await request.formData()
  const category = String(form.get('category') ?? '').trim()
  const description = String(form.get('description') ?? '').trim()
  const location = String(form.get('location') ?? '').trim()
  if (!category || !description || !location) return NextResponse.json({ error: 'Category, problem and location are required.' }, { status: 400 })
  const severity = String(form.get('severity') ?? 'Medium')
  const priority = severity === 'Critical' || severity === 'High' ? severity : severity === 'Low' ? 'Low' : 'Medium'
  const { data: issue, error: issueError } = await supabase.from('civic_issues').insert({ reporter_id: user?.id ?? null, category, description, location, additional_details: String(form.get('details') ?? '').trim() || null, original_language: String(form.get('language') ?? 'EN'), voice_transcript: String(form.get('voiceTranscript') ?? '').trim() || null, severity, priority_level: priority, affected_people: Number(form.get('affected') ?? 1) || 1, current_status: 'NEW' }).select('issue_id,category,description,location,priority_level,current_status,created_at').single()
  if (issueError || !issue) return NextResponse.json({ error: 'Unable to save the issue. Please try again.' }, { status: 500 })
  const files = form.getAll('files').filter((value): value is File => value instanceof File && value.size > 0)
  for (const file of files) {
    if (!allowedTypes.has(file.type) || file.size > maxFileSize) return NextResponse.json({ error: 'One or more files are invalid. Use JPG, PNG, WEBP, MP4, MOV or WEBM under 25 MB.' }, { status: 400 })
    const path = `${user?.id ?? 'anonymous'}/${issue.issue_id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const upload = await supabase.storage.from('issue-media').upload(path, file, { contentType: file.type, upsert: false })
    if (upload.error) return NextResponse.json({ error: 'Issue saved, but media upload failed. Please retry with the media removed.' }, { status: 500 })
    const media = await supabase.from('issue_media').insert({ issue_id: issue.issue_id, file_path: path, file_type: file.type, file_size: file.size, uploaded_by: user?.id ?? null })
    if (media.error) return NextResponse.json({ error: 'Issue saved, but media metadata could not be recorded.' }, { status: 500 })
  }
  await supabase.from('notifications').insert({ issue_id: issue.issue_id, type: priority === 'Critical' ? 'CRITICAL_ISSUE' : 'NEW_ISSUE', title: priority === 'Critical' ? 'Critical issue requires attention' : 'New civic issue submitted', message: `${category} reported at ${location}`, priority, read_status: false })
  return NextResponse.json({ issue, department: departmentFor(category) }, { status: 201 })
}
