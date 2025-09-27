import { atomWithStorage } from 'jotai/utils'

// Persist the leader's selected chapter (or null) in localStorage
export const leaderSelectedChapterAtom = atomWithStorage<string | null>(
  'leaderSelectedChapter',
  null,
)
