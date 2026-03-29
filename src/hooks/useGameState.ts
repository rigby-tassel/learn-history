import { useState, useCallback } from 'react'
import type { GameState, XPEvent, Achievement, XPAwardResult, LevelInfo } from '@/types'
import { LEVEL_THRESHOLDS, XP_REWARDS, ACHIEVEMENT_DEFS } from '@/constants'

const STORAGE_KEY = 'history-explorer-game-state'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function createDefaultState(): GameState {
  return {
    xp: 0,
    level: 1,
    streak: { current: 0, lastActiveDate: '' },
    achievements: ACHIEVEMENT_DEFS.map(a => ({ ...a, unlockedAt: null })),
    stats: {
      totalSessions: 0,
      totalTopicsExplored: [],
      perfectQuizzes: 0,
      subtopicsExplored: 0,
    },
  }
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw)
    // Ensure all achievement defs exist (in case we add new ones)
    const existingIds = new Set(parsed.achievements?.map((a: Achievement) => a.id) || [])
    const merged = [
      ...(parsed.achievements || []),
      ...ACHIEVEMENT_DEFS.filter(a => !existingIds.has(a.id)).map(a => ({ ...a, unlockedAt: null })),
    ]
    return { ...createDefaultState(), ...parsed, achievements: merged }
  } catch {
    return createDefaultState()
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* private browsing */ }
}

function getLevelForXP(xp: number): LevelInfo {
  let current = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xpThreshold) current = t
    else break
  }
  return current
}

function getNextLevel(currentLevel: number): LevelInfo | null {
  const idx = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel)
  return idx >= 0 && idx < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[idx + 1] : null
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState)

  const update = useCallback((patch: Partial<GameState> | ((prev: GameState) => GameState)) => {
    setState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      next.level = getLevelForXP(next.xp).level
      saveState(next)
      return next
    })
  }, [])

  const awardXP = useCallback((event: XPEvent): XPAwardResult => {
    const amount = XP_REWARDS[event]
    let result: XPAwardResult = { amount, newTotal: 0, leveledUp: false }

    setState(prev => {
      const oldLevel = getLevelForXP(prev.xp)
      const newXP = prev.xp + amount
      const newLevelInfo = getLevelForXP(newXP)
      const leveledUp = newLevelInfo.level > oldLevel.level

      result = { amount, newTotal: newXP, leveledUp, newLevel: leveledUp ? newLevelInfo : undefined }

      const next = { ...prev, xp: newXP, level: newLevelInfo.level }
      saveState(next)

      // Dispatch events for UI
      window.dispatchEvent(new CustomEvent('game-xp-awarded', { detail: { amount, newTotal: newXP, leveledUp, newLevel: newLevelInfo } }))
      if (leveledUp) {
        window.dispatchEvent(new CustomEvent('game-level-up', { detail: newLevelInfo }))
        window.dispatchEvent(new Event('game-confetti'))
      }

      return next
    })

    return result
  }, [])

  const triggerConfetti = useCallback(() => {
    window.dispatchEvent(new Event('game-confetti'))
  }, [])

  const recordSessionStart = useCallback(() => {
    update(prev => {
      const today = getToday()
      const yesterday = getYesterday()
      let newStreak = prev.streak.current

      if (prev.streak.lastActiveDate === today) {
        // Already counted today
      } else if (prev.streak.lastActiveDate === yesterday) {
        newStreak += 1
      } else {
        newStreak = 1
      }

      return {
        ...prev,
        streak: { current: newStreak, lastActiveDate: today },
      }
    })
  }, [update])

  const recordSessionComplete = useCallback((topic: string, correct: number, total: number) => {
    update(prev => {
      const topics = prev.stats.totalTopicsExplored.includes(topic)
        ? prev.stats.totalTopicsExplored
        : [...prev.stats.totalTopicsExplored, topic]
      const isPerfect = correct === total && total > 0
      const next: GameState = {
        ...prev,
        stats: {
          ...prev.stats,
          totalSessions: prev.stats.totalSessions + 1,
          totalTopicsExplored: topics,
          perfectQuizzes: prev.stats.perfectQuizzes + (isPerfect ? 1 : 0),
        },
      }

      // Check achievements
      const unlock = (id: string) => {
        const a = next.achievements.find(a => a.id === id)
        if (a && !a.unlockedAt) {
          a.unlockedAt = new Date().toISOString()
          window.dispatchEvent(new CustomEvent('game-achievement', { detail: a }))
          window.dispatchEvent(new Event('game-confetti'))
        }
      }

      if (next.stats.totalSessions >= 1) unlock('first-explorer')
      if (isPerfect) unlock('perfect-score')
      if (next.stats.totalTopicsExplored.length >= 5) unlock('curious-mind')
      if (next.streak.current >= 3) unlock('streak-3')
      if (next.streak.current >= 7) unlock('streak-7')
      if (next.level >= 5) unlock('level-5')
      if (next.xp >= 500) unlock('xp-500')

      return next
    })
  }, [update])

  const recordSubtopic = useCallback(() => {
    update(prev => {
      const next = {
        ...prev,
        stats: { ...prev.stats, subtopicsExplored: prev.stats.subtopicsExplored + 1 },
      }
      const a = next.achievements.find(a => a.id === 'deep-diver')
      if (a && !a.unlockedAt) {
        a.unlockedAt = new Date().toISOString()
        window.dispatchEvent(new CustomEvent('game-achievement', { detail: a }))
        window.dispatchEvent(new Event('game-confetti'))
      }
      return next
    })
  }, [update])

  const currentLevel = getLevelForXP(state.xp)
  const nextLevel = getNextLevel(currentLevel.level)
  const xpProgress = nextLevel
    ? (state.xp - currentLevel.xpThreshold) / (nextLevel.xpThreshold - currentLevel.xpThreshold)
    : 1

  return {
    state,
    awardXP,
    triggerConfetti,
    recordSessionStart,
    recordSessionComplete,
    recordSubtopic,
    currentLevel,
    nextLevel,
    xpProgress,
  }
}
