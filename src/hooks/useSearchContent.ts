import { useMutation } from '@tanstack/react-query'
import { searchContent } from '@/lib/api'

export function useSearchContent() {
  return useMutation({
    mutationFn: (topic: string) => searchContent(topic),
  })
}
