import { useEffect, useMemo, useState } from "react";
import type { Icon } from "../types/icon";

type Props = {
  icons: Icon[];
  onClose: () => void;
};

type Question = {
  icon: Icon;
  answers: string[];
};

export const QuizModal = ({ icons, onClose }: Props) => {
  const [mode, setMode] = useState<"classic" | "endless">("classic");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [bestScore, setBestScore] = useState<number>(() => {
    const stored = sessionStorage.getItem("quizBestScore");
    return stored ? parseInt(stored) : 0;
  });

  const characters = useMemo(() => {
    const grouped: Record<string, Icon[]> = {};
    for (const icon of icons) {
      if (!grouped[icon.character_id]) grouped[icon.character_id] = [];
      grouped[icon.character_id].push(icon);
    }
    return Object.values(grouped);
  }, [icons]);

  const shuffledCharacters = useMemo(() => {
    return [...characters].sort(() => 0.5 - Math.random());
  }, [characters, mode]);

  const QUESTIONS_COUNT = mode === "classic" ? 10 : shuffledCharacters.length;

  useEffect(() => {
    if (characters.length < 4) return;
    if (questionIndex >= QUESTIONS_COUNT) return;
    if (gameOver) return;

    const correctGroup =
      mode === "classic"
        ? characters[Math.floor(Math.random() * characters.length)]
        : shuffledCharacters[questionIndex];

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
  }, [questionIndex, mode, shuffledCharacters]);

  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
      sessionStorage.setItem("quizBestScore", score.toString());
    }
  }, [gameOver, score, bestScore]);

  if (!question && !gameOver) return null;

  const resetGame = (newMode: "classic" | "endless") => {
    setMode(newMode);
    setQuestionIndex(0);
    setScore(0);
    setGameOver(false);
  };

  const handleAnswer = (name: string) => {
    if (answered || gameOver) return;
    setAnswered(true);

    if (name === question!.icon.name) {
      setScore((s) => s + 1);
      setTimeout(() => {
        setQuestionIndex((i) => i + 1);
      }, 800);
    } else {
      if (mode === "endless") {
        setTimeout(() => {
          setGameOver(true);
        }, 800);
      } else {
        setTimeout(() => {
          setQuestionIndex((i) => i + 1);
        }, 800);
      }
    }
  };

  // FIN DU QUIZ
  if (gameOver || questionIndex >= QUESTIONS_COUNT) {
    const percentage =
      mode === "classic" ? Math.round((score / 10) * 100) : 100;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/30 rounded-3xl p-10 text-center max-w-md w-full shadow-2xl shadow-purple-500/20">
          <div className="mb-8">
            <div className="text-6xl mb-4">
              {mode === "endless"
                ? "💀"
                : percentage >= 80
                  ? "🏆"
                  : percentage >= 60
                    ? "⭐"
                    : percentage >= 40
                      ? "👍"
                      : "💪"}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {mode === "endless" ? "Game Over!" : "Quiz Complete!"}
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {mode === "classic" ? `${score} / 10` : score}
            </div>
            <p className="text-gray-400 uppercase tracking-wider text-sm">
              {mode === "classic" ? "Correct answers" : "Score"}
            </p>
          </div>

          {mode === "endless" && (
            <p className="text-gray-400 mb-6">
              Best score this session:{" "}
              <span className="text-white font-bold">{bestScore}</span>
            </p>
          )}

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

  if (!question) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/30 rounded-3xl w-full max-w-lg p-8 shadow-2xl shadow-purple-500/20"
      >
        {/* Header compact */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {mode === "classic" && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
                <span className="text-sm font-bold">
                  {questionIndex + 1} / 10
                </span>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-4 py-2">
              <span className="text-sm font-bold">⭐ {score}</span>
            </div>

            {/* MODE SWITCH intégré */}
            <div className="flex gap-2">
              <button
                onClick={() => resetGame("classic")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  mode === "classic"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Classic
              </button>

              <button
                onClick={() => resetGame("endless")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  mode === "endless"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                Endless
              </button>
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
    </div>
  );
};
