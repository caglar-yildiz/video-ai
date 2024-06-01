import { Lang } from "@/i18n-config"
import { type FrequentlyAskedQuestion } from "@/types"
import { prisma } from "@/db"

export async function getFrequentlyAskedQuestions(
  lang: Lang
): Promise<FrequentlyAskedQuestion[]> {
  return prisma.fAQ.findMany({
    where: {
      lang,
    },
  })
}
