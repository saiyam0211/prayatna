import React, { useState, useEffect } from "react";
import { Trophy, ArrowRight, ArrowLeft, BookOpen, FlaskConical } from "lucide-react";
import questionsData from '../../data/questionsData';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const classOptions = [
  { value: 6, label: "Class 6" },
  { value: 7, label: "Class 7" },
  { value: 8, label: "Class 8" },
  { value: 9, label: "Class 9" },
  { value: 10, label: "Class 10" },
  { value: 11, label: "Class 11" },
  { value: 12, label: "Class 12" },
];

const subjectOptions = [
  { value: "math", label: "Math", icon: <BookOpen className="w-4 h-4 mr-1" /> },
  { value: "science", label: "Science", icon: <FlaskConical className="w-4 h-4 mr-1" /> },
];

export default function GameplayQuiz() {
  const [classLevel, setClassLevel] = useState(6);
  const [topic, setTopic] = useState<"math" | "science">("math");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (gameStarted) {
      const questions = questionsData[classLevel][topic].slice(0, numberOfQuestions);
      setSelectedQuestions(questions);
      setSelectedOption(null);
    }
  }, [gameStarted, classLevel, topic, numberOfQuestions]);

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const checkAnswer = (selected: string) => {
    setSelectedOption(selected);
    if (selected === selectedQuestions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => nextQuestion(), 700);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < selectedQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameEnded(true);
      setGameStarted(false);
    }
  };

  const goHome = () => {
    setGameStarted(false);
    setGameEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] via-[#F2F5F7] to-[#E5E7EB]">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-[#4BA3C7]/20 p-8">
        {!gameStarted && !gameEnded && (
          <div>
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-[#7DDE92]" /> Gamified Learning Quiz
            </h1>
            <p className="text-[#6B7280] mb-6">Sharpen your skills with quick questions!</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Select Class</label>
                <select
                  className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2 focus:border-[#4BA3C7] focus:ring-2 focus:ring-[#4BA3C7]/30 transition"
                  value={classLevel}
                  onChange={(e) => setClassLevel(Number(e.target.value))}
                >
                  {classOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Select Subject</label>
                <div className="flex gap-3">
                  {subjectOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                        topic === opt.value
                          ? "border-[#4BA3C7] bg-[#4BA3C7]/10 text-[#4BA3C7]"
                          : "border-[#E5E7EB] hover:border-[#4BA3C7]/50 text-[#6B7280]"
                      }`}
                      onClick={() => setTopic(opt.value as "math" | "science")}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Number of Questions</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="w-24 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:border-[#4BA3C7] focus:ring-2 focus:ring-[#4BA3C7]/30 transition"
                />
              </div>
              <button
                className="w-full mt-4 bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
                onClick={startGame}
              >
                Start Game <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {gameStarted && !gameEnded && selectedQuestions.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">
                Question {currentQuestionIndex + 1} of {selectedQuestions.length}
              </span>
              <span className="text-sm text-[#4BA3C7] font-bold">
                Score: {score}
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4">{selectedQuestions[currentQuestionIndex].question}</h2>
              <div className="grid grid-cols-1 gap-3">
                {selectedQuestions[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = selectedOption && option === selectedQuestions[currentQuestionIndex].answer;
                  const isWrong = selectedOption && option === selectedOption && option !== selectedQuestions[currentQuestionIndex].answer;
                  return (
                    <button
                      key={idx}
                      className={`w-full px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 shadow-sm text-left
                        ${
                          selectedOption
                            ? isCorrect
                              ? "border-[#7DDE92] bg-[#7DDE92]/10 text-[#2D2D2D]"
                              : isWrong
                              ? "border-[#F76E6E] bg-[#F76E6E]/10 text-[#F76E6E]"
                              : "border-[#E5E7EB] text-[#6B7280] opacity-60"
                            : "border-[#E5E7EB] hover:border-[#4BA3C7] hover:bg-[#4BA3C7]/5 text-[#2D2D2D]"
                        }
                      `}
                      disabled={!!selectedOption}
                      onClick={() => checkAnswer(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5 transition"
                onClick={goHome}
              >
                <ArrowLeft className="w-4 h-4" /> Home
              </button>
              <button
                className="flex items-center gap-1 px-6 py-2 rounded-lg bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] text-white font-medium shadow-lg hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 transition-all"
                onClick={nextQuestion}
                disabled={!selectedOption}
              >
                {currentQuestionIndex + 1 === selectedQuestions.length ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {gameEnded && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#7DDE92] to-[#A484F3] rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Game Over!</h1>
            <h2 className="text-xl font-semibold text-[#4BA3C7] mb-6">
              Your Score: {score} / {selectedQuestions.length}
            </h2>
            <button
              className="w-full bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
              onClick={goHome}
            >
              Go Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}