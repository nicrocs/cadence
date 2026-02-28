export type BreakSuggestion = {
  category: 'movement' | 'outside' | 'breathing'
  text: string
}

export const BREAK_SUGGESTIONS: BreakSuggestion[] = [
  // Outside / look away
  { category: 'outside', text: 'Step outside for a few minutes. Let your eyes focus on something far away.' },
  { category: 'outside', text: 'Look out a window at something in the distance for at least 20 seconds.' },
  { category: 'outside', text: 'Get some fresh air. No phone.' },

  // Movement
  { category: 'movement', text: 'Roll your shoulders back and stretch your neck slowly side to side.' },
  { category: 'movement', text: 'Stand up and do 10 slow neck and shoulder rolls.' },
  { category: 'movement', text: 'Walk around for a few minutes. No destination needed.' },
  { category: 'movement', text: 'Stretch your wrists and forearms — they\'ve been working too.' },

  // Breathing
  { category: 'breathing', text: 'Four counts in, hold for four, out for four. Three times.' },
  { category: 'breathing', text: 'Close your eyes and take five slow, deliberate breaths.' },
  { category: 'breathing', text: 'Relax your jaw, drop your shoulders, and breathe slowly for one minute.' },
]

export function getRandomSuggestion(): BreakSuggestion {
  return BREAK_SUGGESTIONS[Math.floor(Math.random() * BREAK_SUGGESTIONS.length)]
}