import { generateText, Output } from 'ai'
import { z } from 'zod'

const issueSchema = z.object({
  category: z.string(),
  problem: z.string(),
  location: z.string(),
  duration: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  peopleAffected: z.number().nullable(),
  missingInformation: z.array(z.enum(['location', 'duration', 'severity', 'peopleAffected'])),
  followUpQuestion: z.string().nullable(),
})

export async function POST(request: Request) {
  try {
    const { transcript, language } = await request.json()
    if (typeof transcript !== 'string' || !transcript.trim()) {
      return Response.json({ error: 'Transcript is required.' }, { status: 400 })
    }

    const { output } = await generateText({
      model: 'openai/gpt-5-mini',
      output: Output.object({ schema: issueSchema }),
      system: 'You understand civic issue reports in Telugu, Hindi, and English. Preserve the citizen\'s original language in problem and followUpQuestion. Extract only what is stated; use empty strings or null for missing values and ask one simple follow-up question when key information is missing. Do not translate the citizen-facing text to English.',
      prompt: `Language selected: ${language}. Citizen report: ${transcript}`,
    })

    return Response.json(output)
  } catch {
    return Response.json({ error: 'Unable to understand the report right now.' }, { status: 502 })
  }
}
