import { NextResponse } from 'next/server'

const STEAM_API_KEY = process.env.STEAM_API_KEY

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shareCode = searchParams.get('code')
  const steamid = searchParams.get('steamid')
  const vanity = searchParams.get('vanity')

  try {
    let resolvedId = steamid

    if (vanity && !steamid) {
      const res = await fetch(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanity}`
      )
      const data = await res.json()
      if (data.response?.success !== 1) {
        return NextResponse.json({ error: 'Steam профиль не найден' }, { status: 404 })
      }
      resolvedId = data.response.steamid
    }

    if (shareCode && resolvedId) {
      // Получаем следующий матч — это возвращает demo download url
      const res = await fetch(
        `https://api.steampowered.com/ICSGOPlayers_730/GetNextMatchSharingCode/v1/?key=${STEAM_API_KEY}&steamid=${resolvedId}&steamidkey=AAAAAAAAAAAAAAAAAAsdfgh&knowncode=${shareCode}`
      )
      const data = await res.json()
      console.log('[STEAM]', JSON.stringify(data))

      // Получаем инфо о матче через другой endpoint
      const matchRes = await fetch(
        `https://api.steampowered.com/ICSGO730/GetMatchInfo/v1/?key=${STEAM_API_KEY}&match_sharing_code=${shareCode}`
      )
      const matchData = await matchRes.json()
      console.log('[STEAM MATCH]', JSON.stringify(matchData))

      return NextResponse.json({
        share_code: shareCode,
        steamid: resolvedId,
        next_code: data.result?.nextcode,
        match: matchData,
        raw: data,
      })
    }

    if (resolvedId) {
      const playerRes = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${resolvedId}`
      )
      const playerData = await playerRes.json()
      const player = playerData.response?.players?.[0]
      return NextResponse.json({
        steamid: resolvedId,
        name: player?.personaname,
        avatar: player?.avatarfull,
      })
    }

    return NextResponse.json({ error: 'Нужен steamid и code' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}