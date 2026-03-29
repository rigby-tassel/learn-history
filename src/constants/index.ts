import type { Achievement, LevelInfo, XPEvent } from '@/types'

export const LEVEL_THRESHOLDS: LevelInfo[] = [
  { level: 1, xpThreshold: 0, name: 'Rookie' },
  { level: 2, xpThreshold: 100, name: 'Curious Explorer' },
  { level: 3, xpThreshold: 250, name: 'Knowledge Seeker' },
  { level: 4, xpThreshold: 450, name: 'Quick Learner' },
  { level: 5, xpThreshold: 700, name: 'Brain Power' },
  { level: 6, xpThreshold: 1100, name: 'Master Mind' },
  { level: 7, xpThreshold: 1600, name: 'Walking Encyclopedia' },
]

export const XP_REWARDS: Record<XPEvent, number> = {
  'card-complete': 10,
  'quiz-correct': 25,
  'session-complete': 50,
  'subtopic-explore': 15,
}

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first-explorer', name: 'First Explorer', description: 'Complete your first session', icon: '🧭' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯' },
  { id: 'curious-mind', name: 'Curious Mind', description: 'Explore 5 different topics', icon: '🧠' },
  { id: 'deep-diver', name: 'Deep Diver', description: 'Explore a subtopic', icon: '🤿' },
  { id: 'streak-3', name: 'On Fire', description: '3-day learning streak', icon: '🔥' },
  { id: 'streak-7', name: 'Unstoppable', description: '7-day learning streak', icon: '⚡' },
  { id: 'level-5', name: 'Scholar', description: 'Reach level 5', icon: '🎓' },
  { id: 'xp-500', name: 'XP Hunter', description: 'Earn 500 total XP', icon: '💎' },
]

export const LOADING_FACTS = [
  'The Great Wall of China is over 13,000 miles long!',
  'Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.',
  'Octopuses have three hearts and blue blood.',
  'A group of flamingos is called a "flamboyance."',
  'The shortest war in history lasted only 38 minutes.',
  'Bananas are technically berries, but strawberries are not.',
]

export const LOADING_MESSAGES = [
  'Digging up the good stuff...',
  'Gathering the best stories...',
  'Almost there...',
  'Finding the coolest facts...',
]

export const LESSON_SYSTEM_PROMPT = `You are an engaging, enthusiastic teacher for students aged 12-14. You can teach ANY subject — history, science, sports, pop culture, nature, technology, or anything else. You make learning come alive with vivid storytelling, surprising facts, and connections to the real world.

When given a topic, create exactly 6 lesson cards. Each card should be a self-contained mini-lesson that builds on the previous ones. Adapt your style to the subject — be a sports commentator for sports topics, a scientist for science topics, a historian for history topics, etc.

Respond with valid JSON matching this exact structure:
{
  "lessonCards": [
    {
      "id": "card-1",
      "order": 1,
      "title": "A short engaging title",
      "content": "2-3 paragraphs of engaging, age-appropriate content. Use vivid language and storytelling. Include specific names, dates, and places.",
      "funFact": "A surprising or cool fact related to this card's content",
      "keyDates": ["Key event or milestone with date/year"],
      "mediaType": "image",
      "mediaSearchTerm": "a simple 2-3 word search term for finding a relevant stock photo (e.g. 'egyptian pyramids', 'basketball court', 'space shuttle')",
      "mediaCaption": "Short caption for the image"
    }
  ],
  "quizQuestions": [
    {
      "id": "q-1",
      "type": "multiple_choice",
      "question": "An engaging question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "A brief, encouraging explanation of why this is correct"
    },
    {
      "id": "q-2",
      "type": "true_false",
      "question": "A true/false statement about the content",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Explanation"
    },
    {
      "id": "q-3",
      "type": "free_response",
      "question": "An open-ended question that checks understanding",
      "correctAnswer": "Key points the answer should include",
      "explanation": "What a good answer looks like"
    }
  ],
  "suggestedSubtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
}`

export const EVALUATE_SYSTEM_PROMPT = `You are a friendly, encouraging teacher evaluating a student's answer. The student is 12-14 years old.

Given the question, the expected answer, and the student's answer, determine if they demonstrated understanding. Be generous — accept answers that show the right idea even if they use different words or miss minor details.

Respond with valid JSON:
{
  "isCorrect": true/false,
  "feedback": "Brief, encouraging feedback (1-2 sentences). If wrong, gently explain the right answer."
}`
