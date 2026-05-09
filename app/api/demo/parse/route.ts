import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({
    ok: true,
    data: { test: true, message: "API работает, VPS не используется" }
  })
}