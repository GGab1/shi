import { useEffect, useState } from "react";
import type { Icon } from "../types/icon";

type Props = {
  icons: Icon[];
  onClose: () => void;
};

type Question = {
  icon: Icon;
  answers: string[];
};

const QUESTIONS_COUNT = 10;

export const QuizModal = ({ icons, onClose }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);

  const characters = (() => {
    const grouped: Record<string, Icon[]> = {};
    for (const icon of icons) {
      if (!grouped[icon.character_id]) grouped[icon.character_id] = [];
      grouped[icon.character_id].push(icon);
    }
    return Object.values(grouped);
  })();

  useEffect(() => {
    if (characters.length < 4) return;

    const correctGroup =
      characters[Math.floor(Math.random() * characters.length)];
    const correctIcon =
      correctGroup[Math.floor(Math.random() * correctGroup.length)];

    const wrongNames = characters
      .filter((group) => group[0].character_id !== correctIcon.character_id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((group) => group[0].name);

    const answers = [...wrongNames, correctIcon.name].sort(
      () => 0.5 - Math.random(),
    );

    setQuestion({ icon: correctIcon, answers });
    setAnswered(false);
  }, [questionIndex, icons]);

  if (!question) return null;

  const handleAnswer = (name: string) => {
    if (answered) return;
    setAnswered(true);

    if (name === question.icon.name) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setQuestionIndex((i) => i + 1);
    }, 800);
  };

  // Quiz finished
  if (questionIndex >= QUESTIONS_COUNT) {
    const percentage = Math.round((score / QUESTIONS_COUNT) * 100);

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/30 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl shadow-purple-500/20">
          <div className="mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 80
                ? "🏆"
                : percentage >= 60
                  ? "⭐"
                  : percentage >= 40
                    ? "👍"
                    : "💪"}
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {score} / {QUESTIONS_COUNT}
            </div>
            <p className="text-gray-400 uppercase tracking-wider text-sm">
              Correct answers
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-8 py-4 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/30 rounded-3xl w-full max-w-lg p-8 shadow-2xl shadow-purple-500/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2">
              <span className="text-sm font-bold">
                {questionIndex + 1} / {QUESTIONS_COUNT}
              </span>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-5 py-2">
              <span className="text-sm font-bold">⭐ {score}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            ✕
          </button>
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-center text-gray-400 uppercase tracking-wider text-sm mb-4">
            Who is this character?
          </p>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex items-center justify-center">
            <img
              src={question.icon.pngpath}
              alt="Quiz character"
              className="w-40 h-40 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/* Answers */}
        <div className="grid gap-3">
          {question.answers.map((ans) => {
            const isCorrect = ans === question.icon.name;
            const isWrong = answered && !isCorrect;

            return (
              <button
                key={ans}
                onClick={() => handleAnswer(ans)}
                disabled={answered}
                className={`
                  px-6 py-4 rounded-2xl font-semibold transition-all duration-300
                  backdrop-blur-xl border
                  ${
                    answered && isCorrect
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-500/50 text-white shadow-lg shadow-green-500/50 scale-105"
                      : isWrong
                        ? "bg-red-500/10 border-red-500/30 text-red-400 opacity-50"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-105"
                  }
                  ${answered ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {ans}
                {answered && isCorrect && " ✓"}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
