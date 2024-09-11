import React, { useContext, useEffect } from 'react';
import { AppContext } from '../layout/AppContext';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AppContextType {
  timer: number;
  setTimer: (time: number) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  questions: any[];
}

const Timer: React.FC = () => {
  const {
    timer,
    setTimer,
    setCurrentQuestionIndex,
    questions,
  } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (timer === 0) {
      handleTimeOut();
      return;
    }

    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, setTimer]);

  const handleTimeOut = () => {
    const { currentQuestionIndex } = useContext(AppContext) as AppContextType;

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(60);
    } else {
      // Finaliza la trivia
      // Cambia el estado del ChatBot para mostrar el mensaje final
    }
  };

  const getClassName = (classes: string) => twMerge(clsx(classes));

  return (
    <div className="flex justify-end mb-2">
      <span className={getClassName('text-sm font-medium text-red-500')}>
        Tiempo restante: {timer}s
      </span>
    </div>
  );
};

export default Timer;
