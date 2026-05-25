import { NextResponse } from 'next/server'

const STEAM_API_KEY = process.env.STEAM_API_KEY

export const dynamic = 'force-dynamic'

// Резолвим Share Code в данные матча
function decodeShareCode(shareCode: string) {
  const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789'
  const prefix = 'CSGO-'
  
  if (!shareCode.startsWith(prefix)) return null
  
  const code = shareCode.slice(prefix.length).replace(/-/g, '')
  
  let n = BigInt(0)
  for (const c of code.split('').reverse()) {
    const idx = chars.indexOf(c)
    if (idx === -1) return null
    n = n * BigInt(chars.length) + BigInt(idx)
  }

  const buf = Buffer.alloc(18)
  for (let i = 0; i < 18; i++) {
    buf[i] = Number(n & BigInt(0xff))
    n >>= BigInt(8)
  }

  const matchId = buf.readBigUInt64LE(0)
  const outcomeId = buf.readBigUInt64LE(8)
  const tokenId = buf.readUInt16LE(16)

  return { matchId: matchId.toString(), outcomeId: outcomeId.toString(), tokenId }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shareCode = searchParams.get('code')
  const steamid = searchParams.get('steamid')
  const vanity = searchParams.get('vanity')

  try {
    // Резолвим vanity в steamid
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

    // Если есть share code — декодируем и получаем демку
    if (shareCode) {
      const decoded = decodeShareCode(shareCode)
      if (!decoded) {
        return NextResponse.json({ error: 'Неверный Share Code' }, { status: 400 })
      }

      // Получаем данные матча
      const matchRes = await fetch(
        `https://api.steampowered.com/ICSGOPlayers_730/GetNextMatchSharingCode/v1/?key=${STEAM_API_KEY}&steamid=${resolvedId}&steamidkey=&knowncode=${shareCode}`
      )
      const matchData = await matchRes.json()

      return NextResponse.json({
        decoded,
        next_code: matchData.result?.nextcode,
        steamid: resolvedId,
      })
    }

    // Иначе возвращаем профиль игрока
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
        profileurl: player?.profileurl,
      })
    }

    return NextResponse.json({ error: 'Нужен steamid, vanity или code' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}