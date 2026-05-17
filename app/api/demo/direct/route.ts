import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vpsUrl = process.env.VPS_URL || ''
  return NextResponse.json({
    upload_url: `${vpsUrl}/analyze`,
  })
}