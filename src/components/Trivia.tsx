// src/components/Trivia.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../layout/AppContext';
import Timer from './Timer';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const Trivia: React.FC = () => {
  const {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    score,
    setScore,
    setTimer,
  } = useContext(AppContext)!;

  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

  useEffect(() => {
    const fetchedQuestions: Question[] = [
      {
        question: "¿Cuál es la capital de Francia?",
        options: ["París", "Londres", "Berlín", "Madrid"],
        answer: "París",
      },
    ];
    setQuestions(fetchedQuestions);
    setTimer(60); 
  }, [setQuestions, setTimer]);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setIsQuestionAnswered(true);
  };

  useEffect(() => {
    if (isQuestionAnswered) {
      const timeout = setTimeout(() => {
        setIsQuestionAnswered(false);
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimer(60); 
        } else {
      
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isQuestionAnswered, currentQuestionIndex, questions.length, setCurrentQuestionIndex, setTimer, score]);

  if (questions.length === 0) return <div>Cargando preguntas...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const getClassName = (classes: string) => twMerge(clsx(classes));

  return (
    <div>
      <Timer />
      <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
      <div className="space-y-2">
        {currentQuestion.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={getClassName("w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200")}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-4">
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </div>
    </div>
  );
};

export default Trivia;
