import { useMutation } from '@tanstack/react-query'
import { evaluateAnswer } from '@/lib/api'

export function useEvaluateAnswer() {
  return useMutation({
    mutationFn: (params: { question: string; correctAnswer: string; userAnswer: string }) =>
      evaluateAnswer(params.question, params.correctAnswer, params.userAnswer),
  })
}
