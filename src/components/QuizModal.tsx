import { useEffect, useState } from "react"
import type { Icon } from "../types/icon"

type Props = {
  icons: Icon[]
  onClose: () => void
}

type Question = {
  icon: Icon
  answers: string[]
}

const QUESTIONS_COUNT = 10

export const QuizModal = ({ icons, onClose }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [question, setQuestion] = useState<Question | null>(null)

  // 🔹 Regroupement par personnage
  const characters = (() => {
    const grouped: Record<string, Icon[]> = {}
    for (const icon of icons) {
      if (!grouped[icon.character_id]) grouped[icon.character_id] = []
      grouped[icon.character_id].push(icon)
    }
    return Object.values(grouped)
  })()

  // 🔥 GÉNÉRATION DE QUESTION (SEULEMENT ICI)
  useEffect(() => {
    if (characters.length < 4) return

    const correctGroup =
      characters[Math.floor(Math.random() * characters.length)]

    const correctIcon =
      correctGroup[Math.floor(Math.random() * correctGroup.length)]

    const wrongNames = characters
      .filter(group => group[0].character_id !== correctIcon.character_id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(group => group[0].name)

    const answers = [...wrongNames, correctIcon.name].sort(
      () => 0.5 - Math.random()
    )

    setQuestion({ icon: correctIcon, answers })
    setAnswered(false)
  }, [questionIndex, icons])

  if (!question) return null

  const handleAnswer = (name: string) => {
    if (answered) return
    setAnswered(true)

    if (name === question.icon.name) {
      setScore(s => s + 1)
    }

    setTimeout(() => {
      setQuestionIndex(i => i + 1)
    }, 800)
  }

  // 🔚 FIN DU QUIZ
  if (questionIndex >= QUESTIONS_COUNT) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl text-center max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Quiz finished</h2>
          <p className="text-lg mb-6">
            Score: <b>{score}</b> / {QUESTIONS_COUNT}
          </p>
          <button
            onClick={onClose}
            className="bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-300"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-zinc-900 rounded-xl w-full max-w-md p-6 text-center"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest">
            Question {questionIndex + 1}/{QUESTIONS_COUNT}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Icon */}
        <img
          src={question.icon.pngpath}
          alt={question.icon.name}
          className="mx-auto w-32 h-32 object-contain mb-6"
        />

        {/* Answers */}
        <div className="grid gap-3">
          {question.answers.map(ans => {
            const isCorrect = ans === question.icon.name

            return (
              <button
                key={ans}
                onClick={() => handleAnswer(ans)}
                className={`
                  px-4 py-3 rounded font-bold transition
                  ${
                    answered
                      ? isCorrect
                        ? "bg-green-500 text-black"
                        : "bg-zinc-800 text-zinc-500"
                      : "bg-zinc-800 hover:bg-yellow-400 hover:text-black"
                  }
                `}
              >
                {ans}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
