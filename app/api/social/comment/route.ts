export async function POST(request: Request) {
  const { highlight_id, user_nickname, text } = await request.json()
  const { error } = await supabase.from('comments').insert({ highlight_id, user_nickname, text })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const highlight_id = searchParams.get('highlight_id')
  const { data, error } = await supabase.from('comments').select('*').eq('highlight_id', highlight_id).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comments: data })
}