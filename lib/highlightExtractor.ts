export type HighlightMoment = {
  title: string
  description: string
  highlight_type: string
  round_number?: number
  kills?: number
  damage?: number
  score?: number
  map_name?: string
  stats?: any
  raw?: any
}

function normalizeName(value: any) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function getPlayerName(player: any) {
  return player?.name || player?.userName || player?.nickname || ''
}

function getMapName(stats: any) {
  return stats?.mapName || stats?.map || stats?.map_name || 'unknown'
}

function findTargetPlayer(stats: any, nickname: string) {
  const players = stats?.players || {}
  const nick = normalizeName(nickname)

  let fallback: any = null

  for (const [steamId, player] of Object.entries(players) as any) {
    const name = normalizeName(getPlayerName(player))

    if (!fallback) {
      fallback = { steamId, ...player }
    }

    if (
      name === nick ||
      name.includes(nick) ||
      nick.includes(name)
    ) {
      return { steamId, ...player }
    }
  }

  // если ник не совпал, берём самого результативного
  let topPlayer = fallback

  for (const [steamId, player] of Object.entries(players) as any) {
    if (!topPlayer || Number(player?.killCount || 0) > Number(topPlayer?.killCount || 0)) {
      topPlayer = { steamId, ...player }
    }
  }

  return topPlayer
}

function getRoundNumber(round: any, index: number) {
  return (
    round?.roundNumber ||
    round?.round_number ||
    round?.roundNum ||
    round?.round_id ||
    index + 1
  )
}

function getEvents(round: any) {
  if (Array.isArray(round?.events)) return round.events
  if (Array.isArray(round?.kills)) return round.kills
  return []
}

function getAttackerName(event: any) {
  return (
    event?.attacker_name ||
    event?.attackerName ||
    event?.attacker?.name ||
    event?.attacker?.playerName ||
    event?.killerName ||
    event?.killer_name ||
    ''
  )
}

function isKillEvent(event: any) {
  const type = String(event?.type || event?.eventType || event?.event || '').toLowerCase()

  if (type.includes('kill')) return true

  return Boolean(
    event?.attacker_name ||
    event?.attackerName ||
    event?.killerName ||
    event?.killer_name
  )
}

export function extractHighlightMoments(stats: any, nickname: string): HighlightMoment[] {
  const moments: HighlightMoment[] = []

  if (!stats) return moments

  const mapName = getMapName(stats)
  const targetPlayer = findTargetPlayer(stats, nickname)

  if (!targetPlayer) return moments

  const targetName = getPlayerName(targetPlayer)
  const normalizedTargetName = normalizeName(targetName)

  const rounds = Array.isArray(stats?.rounds) ? stats.rounds : []

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i]
    const events = getEvents(round)

    const kills = events.filter((event: any) => {
      if (!isKillEvent(event)) return false

      const attacker = normalizeName(getAttackerName(event))

      return (
        attacker === normalizedTargetName ||
        attacker.includes(normalizedTargetName) ||
        normalizedTargetName.includes(attacker)
      )
    })

    const killCount = kills.length
    const roundNumber = getRoundNumber(round, i)

    if (killCount >= 5) {
      moments.push({
        title: `${targetName} сделал ACE`,
        description: `5 убийств за раунд на ${mapName}`,
        highlight_type: 'ace',
        round_number: roundNumber,
        kills: killCount,
        map_name: mapName,
        stats: {
          player: targetName,
          round: roundNumber,
          kills: killCount,
        },
        raw: {
          round,
          kills,
        },
      })
    } else if (killCount === 4) {
      moments.push({
        title: `${targetName} сделал 4K`,
        description: `4 убийства за раунд на ${mapName}`,
        highlight_type: '4k',
        round_number: roundNumber,
        kills: killCount,
        map_name: mapName,
        stats: {
          player: targetName,
          round: roundNumber,
          kills: killCount,
        },
        raw: {
          round,
          kills,
        },
      })
    } else if (killCount === 3) {
      moments.push({
        title: `${targetName} сделал 3K`,
        description: `3 убийства за раунд на ${mapName}`,
        highlight_type: '3k',
        round_number: roundNumber,
        kills: killCount,
        map_name: mapName,
        stats: {
          player: targetName,
          round: roundNumber,
          kills: killCount,
        },
        raw: {
          round,
          kills,
        },
      })
    }
  }

  const oneVsOne = Number(targetPlayer?.oneVsOneWonCount || 0)
  const oneVsTwo = Number(targetPlayer?.oneVsTwoWonCount || 0)
  const oneVsThree = Number(targetPlayer?.oneVsThreeWonCount || 0)
  const oneVsFour = Number(targetPlayer?.oneVsFourWonCount || 0)
  const oneVsFive = Number(targetPlayer?.oneVsFiveWonCount || 0)

  const totalClutches = oneVsOne + oneVsTwo + oneVsThree + oneVsFour + oneVsFive

  if (totalClutches > 0) {
    moments.push({
      title: `${targetName} выиграл клатч`,
      description: `Клатчи за матч: ${totalClutches}`,
      highlight_type: 'clutch',
      kills: Number(targetPlayer?.killCount || 0),
      damage: Number(targetPlayer?.totalDamage || 0),
      score: Number(targetPlayer?.score || 0),
      map_name: mapName,
      stats: {
        player: targetName,
        oneVsOne,
        oneVsTwo,
        oneVsThree,
        oneVsFour,
        oneVsFive,
      },
      raw: targetPlayer,
    })
  }

  const killCount = Number(targetPlayer?.killCount || 0)
  const deathCount = Number(targetPlayer?.deathCount || 0)
  const headshots = Number(targetPlayer?.headshotCount || 0)
  const damage = Number(targetPlayer?.totalDamage || 0)
  const score = Number(targetPlayer?.score || 0)

  if (killCount >= 25 || score >= 50) {
    moments.push({
      title: `${targetName} разнёс матч`,
      description: `${killCount} убийств, ${deathCount} смертей, ${headshots} хедшотов`,
      highlight_type: 'top_match',
      kills: killCount,
      damage,
      score,
      map_name: mapName,
      stats: {
        player: targetName,
        kills: killCount,
        deaths: deathCount,
        headshots,
        damage,
        score,
      },
      raw: targetPlayer,
    })
  }

  const priority: Record<string, number> = {
    ace: 100,
    '4k': 90,
    clutch: 85,
    '3k': 75,
    top_match: 60,
  }

  return moments
    .sort((a, b) => (priority[b.highlight_type] || 0) - (priority[a.highlight_type] || 0))
    .slice(0, 5)
}