import type { Achievement, LevelInfo, XPEvent } from '@/types'

export const SUGGESTED_TOPICS = [
  { label: 'Ancient Egypt', emoji: '🏛️' },
  { label: 'Roman Empire', emoji: '⚔️' },
  { label: 'Medieval Europe', emoji: '🏰' },
  { label: 'Ancient Greece', emoji: '🏺' },
  { label: 'World War II', emoji: '✈️' },
  { label: 'The Renaissance', emoji: '🎨' },
  { label: 'Aztec Empire', emoji: '🌎' },
  { label: 'Ancient China', emoji: '🐉' },
  { label: 'Viking Age', emoji: '🛡️' },
  { label: 'American Revolution', emoji: '🗽' },
  { label: 'The Space Race', emoji: '🚀' },
  { label: 'Samurai Japan', emoji: '🗾' },
]

export const LEVEL_THRESHOLDS: LevelInfo[] = [
  { level: 1, xpThreshold: 0, name: 'History Rookie' },
  { level: 2, xpThreshold: 100, name: 'Time Traveler' },
  { level: 3, xpThreshold: 250, name: 'History Buff' },
  { level: 4, xpThreshold: 450, name: 'Ancient Scholar' },
  { level: 5, xpThreshold: 700, name: 'Knowledge Keeper' },
  { level: 6, xpThreshold: 1100, name: 'History Master' },
  { level: 7, xpThreshold: 1600, name: 'Legend of the Ages' },
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
  'Cleopatra lived closer to the Moon landing than to the building of the pyramids.',
  'Vikings used to give kittens to new brides as wedding gifts.',
  'Ancient Romans used urine as mouthwash — it actually works as a whitener!',
  'The shortest war in history lasted only 38 minutes.',
  'Aztecs used cacao beans as currency.',
]

export const LOADING_MESSAGES = [
  'Discovering ancient secrets...',
  'Unearthing hidden stories...',
  'Connecting the past to today...',
  'Finding the coolest facts...',
]

export const LESSON_SYSTEM_PROMPT = `You are an engaging history teacher for students aged 12-14. You make history come alive with vivid storytelling, surprising facts, and connections to the modern world.

When given a topic, create exactly 6 lesson cards. Each card should be a self-contained mini-lesson that builds on the previous ones.

Respond with valid JSON matching this exact structure:
{
  "lessonCards": [
    {
      "id": "card-1",
      "order": 1,
      "title": "A short engaging title",
      "content": "2-3 paragraphs of engaging, age-appropriate content. Use vivid language and storytelling. Include specific names, dates, and places.",
      "funFact": "A surprising or cool fact related to this card's content",
      "keyDates": ["1200 BCE - Event description", "1100 BCE - Another event"],
      "mediaType": "image",
      "mediaSearchTerm": "search term for finding a relevant Wikipedia image",
      "mediaCaption": "Caption for the image"
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

export const EVALUATE_SYSTEM_PROMPT = `You are a friendly, encouraging history teacher evaluating a student's answer. The student is 12-14 years old.

Given the question, the expected answer, and the student's answer, determine if they demonstrated understanding. Be generous — accept answers that show the right idea even if they use different words or miss minor details.

Respond with valid JSON:
{
  "isCorrect": true/false,
  "feedback": "Brief, encouraging feedback (1-2 sentences). If wrong, gently explain the right answer."
}`
