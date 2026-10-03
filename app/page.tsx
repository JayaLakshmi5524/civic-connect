'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Droplets,
  FileText,
  Filter,
  Flame,
  Gauge,
  GraduationCap,
  HelpCircle,
  Home,
  Languages,
  Lightbulb,
  ListFilter,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Radio,
  Road,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Upload,
  UserRound,
  Waves,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Issue = {
  id: string
  title: string
  category: string
  location: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: string
  affected: number
  reports: number
  date: string
  department: string
  score: number
  color: string
}

const initialIssues: Issue[] = [
  { id: 'CIV-10245', title: 'Water supply interruption', category: 'Water Supply', location: 'Ward 12 · Lakshmi Nagar', priority: 'Critical', status: 'In Progress', affected: 450, reports: 18, date: 'Today, 09:42', department: 'Water Department', score: 92, color: 'critical' },
  { id: 'CIV-10238', title: 'Large pothole on main road', category: 'Road / Pothole', location: 'MG Road · Market Junction', priority: 'High', status: 'Assigned', affected: 180, reports: 12, date: 'Yesterday', department: 'Public Works', score: 78, color: 'high' },
  { id: 'CIV-10231', title: 'Blocked drainage near homes', category: 'Drainage', location: 'Ward 8 · Green Park', priority: 'High', status: 'Verification', affected: 96, reports: 7, date: 'Sep 28, 2026', department: 'Drainage Department', score: 74, color: 'high' },
  { id: 'CIV-10219', title: 'Streetlight not working', category: 'Streetlight', location: 'Near ZP School · Ward 4', priority: 'Medium', status: 'Resolved', affected: 62, reports: 5, date: 'Sep 26, 2026', department: 'Electrical / Municipality', score: 56, color: 'medium' },
  { id: 'CIV-10204', title: 'Garbage accumulation', category: 'Garbage', location: 'Bus Stand Road · Ward 2', priority: 'Medium', status: 'In Progress', affected: 120, reports: 9, date: 'Sep 24, 2026', department: 'Sanitation', score: 61, color: 'medium' },
]

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Report Issue', icon: Plus },
  { label: 'Track Issue', icon: FileText },
  { label: 'Civic Map', icon: MapPin },
  { label: 'Alerts', icon: Bell },
  { label: 'Help', icon: CircleHelp },
]

const priorityClasses = {
  Critical: 'priority-critical',
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
}

function Logo() {
  return <div className="brand"><div className="brand-mark"><ShieldCheck /></div><div><div className="brand-name">Civic<span>Connect</span></div><div className="brand-sub">Your voice. Our action.</div></div></div>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'Resolved' ? 'success' : status === 'In Progress' ? 'info' : status === 'Verification' ? 'warning' : 'neutral'
  return <span className={`status-badge ${tone}`}><span className="status-dot" />{status}</span>
}

function PriorityBadge({ priority }: { priority: Issue['priority'] }) {
  return <span className={`priority-badge ${priorityClasses[priority]}`}><span className="priority-dot" />{priority}</span>
}

function MapPanel({ compact = false }: { compact?: boolean }) {
  const markers = [
    { left: '19%', top: '36%', type: 'critical' }, { left: '57%', top: '26%', type: 'high' },
    { left: '43%', top: '61%', type: 'high' }, { left: '76%', top: '53%', type: 'medium' },
    { left: '30%', top: '75%', type: 'resolved' }, { left: '84%', top: '25%', type: 'medium' },
  ]
  return <div className={`map-panel ${compact ? 'map-compact' : ''}`}>
    <div className="map-grid" />
    <div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" />
    <div className="map-label label-a">Lakshmi Nagar</div><div className="map-label label-b">Market Junction</div><div className="map-label label-c">Green Park</div>
    {markers.map((marker, index) => <button aria-label={`${marker.type} issue marker`} className={`map-marker marker-${marker.type}`} style={{ left: marker.left, top: marker.top }} key={index}><span>{marker.type === 'critical' ? '!' : ''}</span></button>)}
    <div className="map-card"><div className="map-card-title"><MapPin /> Live civic issues</div><div className="map-card-count">24 <span>in your area</span></div><div className="map-legend"><span><i className="legend-dot critical" />Critical</span><span><i className="legend-dot high" />High</span><span><i className="legend-dot medium" />Medium</span></div></div>
    {!compact && <button className="map-location"><LocateFixed /> Use my location</button>}
  </div>
}

function IssueCard({ issue, onSupport }: { issue: Issue; onSupport?: (id: string) => void }) {
  const [supported, setSupported] = useState(false)
  return <article className="issue-card">
    <div className="issue-card-top"><div className="issue-category"><span className={`category-icon category-${issue.category.toLowerCase().replace(/[^a-z]/g, '')}`}>{issue.category === 'Water Supply' ? <Droplets /> : issue.category === 'Garbage' ? <Trash2 /> : issue.category === 'Streetlight' ? <Lightbulb /> : issue.category === 'Road / Pothole' ? <Road /> : <Waves />}</span><span>{issue.category}</span></div><PriorityBadge priority={issue.priority} /></div>
    <h3>{issue.title}</h3><p className="issue-location"><MapPin />{issue.location}</p>
    <div className="issue-card-meta"><span><UserRound /> {issue.affected} affected</span><span><FileText /> {issue.reports} reports</span></div>
    <div className="issue-card-footer"><StatusBadge status={issue.status} /><button className={`support-button ${supported ? 'is-supported' : ''}`} onClick={() => { setSupported(!supported); onSupport?.(issue.id) }}><ThumbsUp /> {supported ? 'Supporting' : 'I am also affected'}</button></div>
  </article>
}

function TrackPanel({ issue }: { issue: Issue }) {
  const steps = ['Submitted', 'Verification', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed']
  const current = issue.status === 'Verification' ? 1 : issue.status === 'Assigned' ? 3 : issue.status === 'In Progress' ? 4 : issue.status === 'Resolved' ? 5 : 0
  return <div className="track-panel">
    <div className="track-header"><div><p className="eyebrow">Report tracking</p><h2>{issue.id}</h2><p>{issue.title} · {issue.location}</p></div><PriorityBadge priority={issue.priority} /></div>
    <div className="tracker">{steps.map((step, index) => <div className={`tracker-step ${index <= current ? 'done' : ''} ${index === current ? 'current' : ''}`} key={step}><div className="tracker-node">{index < current ? <Check /> : index === current ? <span /> : index + 1}</div><span>{step}</span>{index < steps.length - 1 && <div className="tracker-line" />}</div>)}</div>
    <div className="track-detail"><div><span className="detail-label">Last updated</span><strong>Today, 11:24 AM</strong></div><div><span className="detail-label">Assigned to</span><strong>{issue.department}</strong></div><div><span className="detail-label">Expected update</span><strong>Within 2 days</strong></div></div>
    <div className="track-actions"><Button variant="outline"><MessageCircle data-icon="inline-start" /> Contact support</Button><Button className="button-primary"><Bell data-icon="inline-start" /> Get updates</Button></div>
  </div>
}

function ReportForm({ onSubmit }: { onSubmit: (issue: Issue) => void }) {
  const [category, setCategory] = useState('Water Supply')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('High')
  const [affected, setAffected] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); const id = `CIV-${10300 + Math.floor(Math.random() * 100)}`; onSubmit({ id, title: description || `${category} issue`, category, location: location || 'Location shared from map', priority: severity === 'Critical' ? 'Critical' : severity === 'High' ? 'High' : 'Medium', status: 'Verification', affected: Number(affected) || 1, reports: 1, date: 'Just now', department: category === 'Water Supply' ? 'Water Department' : category === 'Garbage' ? 'Sanitation' : 'Municipality', score: 64, color: 'high' }); setSubmitted(true) }
  if (submitted) return <div className="submitted-state"><div className="submitted-icon"><CheckCircle2 /></div><p className="eyebrow">Report received</p><h2>Thank you for speaking up.</h2><p>Your issue has been added to the civic response queue. We&apos;ll keep you updated as it moves forward.</p><div className="new-id">Your complaint ID <strong>is ready above</strong></div><Button className="button-primary" onClick={() => setSubmitted(false)}>Report another issue <ArrowRight data-icon="inline-end" /></Button></div>
  return <form className="report-form" onSubmit={handleSubmit}>
    <div className="form-intro"><div className="form-step"><span>1</span><div><strong>Tell us what happened</strong><p>A few simple details help us send it to the right team.</p></div></div></div>
    <label>Issue category<select value={category} onChange={e => setCategory(e.target.value)}><option>Water Supply</option><option>Road / Pothole</option><option>Drainage</option><option>Garbage</option><option>Streetlight</option><option>Sewage</option><option>Public Safety / Infrastructure</option><option>Other</option></select></label>
    <label>What is the problem? <span className="optional">Be specific if you can</span><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Example: No water in our street since yesterday..." required /></label>
    <div className="form-grid"><label>Where is it?<div className="input-with-icon"><MapPin /><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Street, landmark or area" required /></div></label><Button type="button" variant="outline" className="location-button" onClick={() => setLocation('My current location · Ward 12')}><LocateFixed data-icon="inline-start" /> Use current location</Button></div>
    <div className="form-grid"><label>How serious is it?<select value={severity} onChange={e => setSeverity(e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><label>People affected <span className="optional">Approximate number</span><input type="number" min="1" value={affected} onChange={e => setAffected(e.target.value)} placeholder="e.g. 50" /></label></div>
    <label>Add a photo <span className="optional">Optional, but helpful</span><div className="upload-box"><Upload /><span>Tap to upload a photo</span><small>JPG or PNG · up to 10 MB</small><input type="file" accept="image/*" /></div></label>
    <div className="form-consent"><input type="checkbox" id="share" defaultChecked /><label htmlFor="share">Share this report publicly so neighbors can support it.</label></div>
    <Button type="submit" className="button-primary button-submit"><Send data-icon="inline-start" /> Submit civic issue <ArrowRight data-icon="inline-end" /></Button>
    <p className="privacy-note"><ShieldCheck /> Your contact details are private and never shown publicly.</p>
  </form>
}

function AuthorityDashboard({ issues, onUpdate }: { issues: Issue[]; onUpdate: (issue: Issue) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All priorities')
  const [selected, setSelected] = useState<Issue | null>(null)
  const filtered = issues.filter(issue => (filter === 'All priorities' || issue.priority === filter) && `${issue.id} ${issue.title} ${issue.location}`.toLowerCase().includes(query.toLowerCase()))
  const stats = [{ label: 'Total issues', value: 24, icon: ListFilter, tone: 'blue' }, { label: 'Critical', value: 3, icon: Flame, tone: 'red' }, { label: 'High priority', value: 8, icon: AlertTriangle, tone: 'orange' }, { label: 'In progress', value: 6, icon: Gauge, tone: 'violet' }, { label: 'Resolved', value: 7, icon: CheckCircle2, tone: 'green' }]
  return <div className="authority-page"><div className="dashboard-heading"><div><p className="eyebrow">Municipal operations</p><h1>Good morning, Ananya.</h1><p>Here&apos;s what needs your team&apos;s attention today.</p></div><Button variant="outline"><DownloadIcon /> Export report</Button></div><div className="stat-grid">{stats.map(stat => <div className="stat-card" key={stat.label}><div className={`stat-icon ${stat.tone}`}><stat.icon /></div><div><span>{stat.label}</span><strong>{stat.value}</strong></div><TrendingUp className="stat-trend" /></div>)}</div><div className="dashboard-grid"><section className="dashboard-card priority-focus"><div className="section-heading"><div><h2>Priority queue</h2><p>Issues ranked by transparent score</p></div><Button variant="ghost" size="sm">View scoring logic <ArrowRight data-icon="inline-end" /></Button></div><div className="priority-bars"><div><span>Critical <b>3</b></span><div className="bar"><i style={{ width: '82%' }} /></div></div><div><span>High <b>8</b></span><div className="bar orange"><i style={{ width: '65%' }} /></div></div><div><span>Medium <b>9</b></span><div className="bar yellow"><i style={{ width: '45%' }} /></div></div></div><div className="focus-issue"><div className="focus-icon"><Droplets /></div><div><strong>Water supply interruption</strong><p>Ward 12 · Lakshmi Nagar · <b>450 affected</b></p></div><PriorityBadge priority="Critical" /><Button size="sm" className="button-primary" onClick={() => setSelected(issues[0])}>Review</Button></div></section><section className="dashboard-card mini-map"><div className="section-heading"><div><h2>Issue activity</h2><p>Live reports across your area</p></div><span className="live-pill"><Radio /> Live</span></div><MapPanel compact /></section></div><section className="dashboard-card issue-table-section"><div className="section-heading"><div><h2>All incoming issues</h2><p>Review, assign and move issues forward.</p></div><Button className="button-primary"><Plus data-icon="inline-start" /> Add issue</Button></div><div className="table-toolbar"><div className="search-box"><Search /><input placeholder="Search issues, locations..." value={query} onChange={e => setQuery(e.target.value)} /></div><div className="filter-select"><Filter /><select value={filter} onChange={e => setFilter(e.target.value)}><option>All priorities</option><option>Critical</option><option>High</option><option>Medium</option></select><ChevronDown /></div><Button variant="outline" size="sm"><SlidersHorizontal data-icon="inline-start" /> More filters</Button></div><div className="responsive-table"><table><thead><tr><th>Issue</th><th>Location</th><th>Priority</th><th>People affected</th><th>Status</th><th>Department</th><th /></tr></thead><tbody>{filtered.map(issue => <tr key={issue.id}><td><div className="table-issue"><span>{issue.id}</span><strong>{issue.title}</strong></div></td><td>{issue.location}</td><td><PriorityBadge priority={issue.priority} /><small className="score-text">Score {issue.score}/100</small></td><td>{issue.affected}</td><td><StatusBadge status={issue.status} /></td><td>{issue.department}</td><td><Button variant="ghost" size="sm" onClick={() => setSelected(issue)}>Review</Button></td></tr>)}</tbody></table></div></section>{selected && <div className="review-drawer"><button aria-label="Close review" className="drawer-close" onClick={() => setSelected(null)}><X /></button><p className="eyebrow">Issue review · {selected.id}</p><h2>{selected.title}</h2><p className="drawer-location"><MapPin /> {selected.location}</p><div className="drawer-priority"><div><span className="detail-label">Priority score</span><strong>{selected.score}/100</strong></div><PriorityBadge priority={selected.priority} /></div><div className="score-explain"><strong>Why this score?</strong><p>Severity 22 · People affected 24 · Safety risk 18 · Duration 12 · Community support 16</p></div><label className="drawer-field">Assigned department<select defaultValue={selected.department}><option>Water Department</option><option>Public Works</option><option>Drainage Department</option><option>Sanitation</option><option>Electrical / Municipality</option></select></label><label className="drawer-field">Update status<select defaultValue={selected.status} onChange={e => onUpdate({ ...selected, status: e.target.value })}><option>Verification</option><option>Verified</option><option>Assigned</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label><label className="drawer-field">Internal remark<textarea placeholder="Add a note for your team..." /></label><Button className="button-primary full-button" onClick={() => setSelected(null)}><Check data-icon="inline-start" /> Save update</Button></div>}</div>
}

function DownloadIcon() { return <FileText data-icon="inline-start" /> }

export default function Page() {
  const [activeNav, setActiveNav] = useState('Home')
  const [issues, setIssues] = useState(initialIssues)
  const [language, setLanguage] = useState('EN')
  const [mobileNav, setMobileNav] = useState(false)
  const trackedIssue = issues[0]
  const visibleIssues = useMemo(() => issues.slice(0, 5), [issues])
  const addIssue = (issue: Issue) => { setIssues(previous => [issue, ...previous]); setActiveNav('Track Issue') }
  const updateIssue = (updated: Issue) => setIssues(previous => previous.map(issue => issue.id === updated.id ? updated : issue))
  const renderContent = () => {
    if (activeNav === 'Authority Dashboard') return <AuthorityDashboard issues={issues} onUpdate={updateIssue} />
    if (activeNav === 'Report Issue') return <div className="page-shell narrow"><div className="page-heading"><p className="eyebrow">Make a difference</p><h1>Report a civic issue</h1><p>Tell us what needs fixing. Your report goes to the right local team.</p></div><div className="report-layout"><ReportForm onSubmit={addIssue} /><aside className="report-aside"><div className="aside-tip"><Sparkles /><strong>Good to know</strong><p>Adding a photo and the number of people affected helps your report get the right priority.</p></div><MapPanel compact /></aside></div></div>
    if (activeNav === 'Track Issue') return <div className="page-shell"><div className="page-heading row-heading"><div><p className="eyebrow">Keep up with progress</p><h1>Track your report</h1><p>See exactly what happens after you speak up.</p></div><div className="track-search"><Search /><input placeholder="Enter complaint ID" defaultValue={trackedIssue.id} /><Button className="button-primary">Track</Button></div></div><TrackPanel issue={trackedIssue} /><div className="section-heading public-heading"><div><h2>Reports you support</h2><p>When neighbors stand together, issues get noticed faster.</p></div></div><div className="issue-grid">{visibleIssues.slice(1, 3).map(issue => <IssueCard key={issue.id} issue={issue} />)}</div></div>
    if (activeNav === 'Civic Map') return <div className="page-shell"><div className="page-heading row-heading"><div><p className="eyebrow">See your neighborhood</p><h1>Civic issue map</h1><p>Explore public reports and follow issues near you.</p></div><Button variant="outline"><LocateFixed data-icon="inline-start" /> Near me</Button></div><MapPanel /><div className="section-heading public-heading"><div><h2>Issues on the map</h2><p>Tap an issue to see how your community is affected.</p></div></div><div className="issue-grid">{visibleIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}</div></div>
    if (activeNav === 'Alerts') return <div className="page-shell"><div className="page-heading"><p className="eyebrow">Stay informed</p><h1>Important alerts</h1><p>Updates that matter to your neighborhood.</p></div><div className="alerts-list"><div className="alert-card alert-critical"><div className="alert-icon"><AlertTriangle /></div><div><span>Critical · Today, 10:15 AM</span><h2>Water supply interruption in Ward 12</h2><p>Repair work is underway near Lakshmi Nagar. Water tankers are available at the community hall from 2 PM.</p></div><ArrowRight /></div><div className="alert-card"><div className="alert-icon"><Road /></div><div><span>Traffic update · Yesterday</span><h2>MG Road partially closed for road repairs</h2><p>Use Market Street as an alternate route. Work is expected to finish by Friday.</p></div><ArrowRight /></div><div className="alert-card"><div className="alert-icon"><CheckCircle2 /></div><div><span>Resolution update · Sep 26</span><h2>Streetlight near ZP School has been fixed</h2><p>Thank you to the 62 residents who reported and supported this issue.</p></div><ArrowRight /></div></div></div>
    if (activeNav === 'Help') return <div className="page-shell"><div className="page-heading"><p className="eyebrow">We are here to help</p><h1>How can we help?</h1><p>Simple answers to common questions.</p></div><div className="help-grid">{['How do I report an issue?', 'How do I track my report?', 'Can I report without a photo?', 'When will my issue be fixed?'].map((question, index) => <div className="help-card" key={question}><div className="help-number">0{index + 1}</div><h2>{question}</h2><p>{index === 0 ? 'Tap Report Issue, fill in a few details and submit. You will get a complaint ID immediately.' : 'Use your complaint ID in Track Issue to see the latest update from your local team.'}</p><ArrowRight /></div>)}</div></div>
    return <div className="home-page"><section className="hero"><div className="hero-copy"><div className="welcome-pill"><span className="pulse-dot" /> Your neighborhood, heard</div><h1>Small reports.<br /><em>Big change.</em></h1><p>Help make your community safer, cleaner and better. Report a problem in just a few simple steps.</p><div className="hero-actions"><Button className="button-primary button-large" onClick={() => setActiveNav('Report Issue')}><Plus data-icon="inline-start" /> Report a problem <ArrowRight data-icon="inline-end" /></Button><Button variant="outline" className="button-large" onClick={() => setActiveNav('Track Issue')}><FileText data-icon="inline-start" /> Track my report</Button></div><div className="trust-row"><div className="avatar-stack"><span>R</span><span>M</span><span>S</span><span>+</span></div><span><strong>2,840 residents</strong> are making a difference</span></div></div><div className="hero-visual"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-circle"><div className="hero-house"><Home /><div className="hero-leaf leaf-one">✦</div><div className="hero-leaf leaf-two">✦</div></div></div><div className="floating-card card-alert"><div className="floating-icon red"><Droplets /></div><div><strong>Water supply issue</strong><span>450 people affected</span></div><CheckCircle2 className="floating-check" /></div><div className="floating-card card-resolved"><div className="floating-icon green"><Lightbulb /></div><div><strong>Streetlight fixed</strong><span>Thanks to 62 reports</span></div><CheckCircle2 className="floating-check" /></div><div className="hero-spark spark-one">✦</div><div className="hero-spark spark-two">✦</div></div></section><section className="home-section quick-actions"><div className="section-heading"><div><p className="eyebrow">Start here</p><h2>How can we help today?</h2></div><button className="voice-button"><MessageCircle /> Hear this in Telugu <span>›</span></button></div><div className="action-grid">{[{ label: 'Report a problem', desc: 'Tell us what needs fixing', icon: Plus, tone: 'blue', target: 'Report Issue' }, { label: 'Track my report', desc: 'See your issue progress', icon: FileText, tone: 'purple', target: 'Track Issue' }, { label: 'View civic issues', desc: 'Explore your neighborhood', icon: MapPin, tone: 'teal', target: 'Civic Map' }, { label: 'Important alerts', desc: 'Stay informed locally', icon: Bell, tone: 'orange', target: 'Alerts' }].map(action => <button className="action-card" key={action.label} onClick={() => setActiveNav(action.target)}><span className={`action-icon ${action.tone}`}><action.icon /></span><span className="action-copy"><strong>{action.label}</strong><small>{action.desc}</small></span><ArrowRight className="action-arrow" /></button>)}</div></section><section className="home-section issue-section"><div className="section-heading"><div><p className="eyebrow">Your community</p><h2>Issues that need attention</h2><p>Public reports from around your neighborhood.</p></div><Button variant="outline" onClick={() => setActiveNav('Civic Map')}>View all issues <ArrowRight data-icon="inline-end" /></Button></div><div className="issue-grid">{visibleIssues.slice(0, 3).map(issue => <IssueCard key={issue.id} issue={issue} />)}</div></section><section className="home-section split-section"><div><p className="eyebrow">For local teams</p><h2>Every report can become action.</h2><p>Authorities use CivicConnect to see what matters most, coordinate departments and keep citizens in the loop.</p><Button variant="outline" onClick={() => setActiveNav('Authority Dashboard')}>Open authority dashboard <ArrowRight data-icon="inline-end" /></Button></div><div className="workflow-mini"><div className="workflow-line" />{['Report', 'Verify', 'Prioritize', 'Resolve'].map((step, index) => <div className="workflow-step" key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}</div></section></div>
  }
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu /></button><button className="logo-button" onClick={() => setActiveNav('Home')}><Logo /></button><nav className={mobileNav ? 'nav-menu open' : 'nav-menu'}>{navItems.map(item => <button className={activeNav === item.label ? 'nav-link active' : 'nav-link'} key={item.label} onClick={() => { setActiveNav(item.label); setMobileNav(false) }}><item.icon />{item.label}</button>)}</nav><div className="header-actions"><button className="language-button" onClick={() => setLanguage(language === 'EN' ? 'TE' : 'EN')}><Languages /> {language}<ChevronDown /></button><Button variant="outline" className="authority-button" onClick={() => setActiveNav('Authority Dashboard')}><BarChart3 data-icon="inline-start" /> Authority dashboard</Button><button className="profile-button"><span>A</span></button></div></div></header><main>{renderContent()}</main><footer className="site-footer"><Logo /><p>Built for communities that care.</p><div><button>Privacy</button><button>Accessibility</button><button>Contact</button></div></footer></div>
}
