import { NextResponse } from 'next/server'

let settings = { adminEmail: 'admin@admin.com', adminPassword: 'admin123' }

export async function GET() {
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const body = await req.json()
  settings.adminEmail = body.adminEmail || ''
  settings.adminPassword = body.adminPassword || ''
  return NextResponse.json({ success: true })
}
