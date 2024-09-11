
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
}

const questions = [
  {
    question: "What is the primary market segment for Valvoline products?",
    choices: ["Automotive enthusiasts", "Professional mechanics", "DIY car owners", "Fleet managers"],
    correctAnswer: 2
  },
  {
    question: "Which age group represents the largest portion of Valvoline's customer base?",
    choices: ["18-25", "26-40", "41-55", "56 and above"],
    correctAnswer: 1
  },
  {
    question: "What is the most common vehicle type owned by Valvoline customers?",
    choices: ["Sedans", "SUVs", "Trucks", "Sports cars"],
    correctAnswer: 1
  },
  {
    question: "Which Valvoline product line is most popular among its customers?",
    choices: ["Synthetic motor oils", "Conventional motor oils", "Transmission fluids", "Fuel additives"],
    correctAnswer: 0
  },
  {
    question: "What percentage of Valvoline customers prefer to change their own oil?",
    choices: ["25%", "40%", "55%", "70%"],
    correctAnswer: 2
  },
  {
    question: "Which factor do Valvoline customers value most when choosing motor oil?",
    choices: ["Brand reputation", "Price", "Performance", "Environmental impact"],
    correctAnswer: 2
  },
  {
    question: "What is the average frequency of oil changes among Valvoline customers?",
    choices: ["Every 3,000 miles", "Every 5,000 miles", "Every 7,500 miles", "Every 10,000 miles"],
    correctAnswer: 1
  },
  {
    question: "Which region has the highest concentration of Valvoline customers?",
    choices: ["Northeast", "Southeast", "Midwest", "West Coast"],
    correctAnswer: 2
  },
  {
    question: "What percentage of Valvoline customers also use the company's other automotive products?",
    choices: ["30%", "45%", "60%", "75%"],
    correctAnswer: 2
  },
  {
    question: "Which social media platform do Valvoline customers engage with the most?",
    choices: ["Facebook", "Instagram", "Twitter", "YouTube"],
    correctAnswer: 3
  }
];

const TriviaForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isFinished]);

  const handleStart = (): void => {
    setIsStarted(true);
  };

  const handleAnswerSelect = (index: number): void => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = (): void => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setAnsweredQuestions(prev => prev + 1);
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimer(0);
    setIsFinished(false);
    setIsStarted(false);
    setAnsweredQuestions(0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Valvoline Customer Trivia</h1>
        <p className="mb-4">Are you ready to test your knowledge?</p>
        <button
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          onClick={handleStart}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Valvoline Customer Trivia</h1>
      
      {!isFinished ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="flex items-center text-lg font-semibold">
              <Timer className="mr-2" /> {formatTime(timer)}
            </span>
          </div>
          
          <h2 className="text-xl mb-4">{questions[currentQuestion].question}</h2>
          
          <div className="space-y-2">
            {questions[currentQuestion].choices.map((choice, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left rounded-md ${
                  selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                {choice}
              </button>
            ))}
          </div>
          
          <button
            className="mt-6 w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 disabled:bg-gray-300"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-2">Your Score: {score}/{questions.length}</p>
          <p className="text-xl mb-2">Questions Answered: {answeredQuestions}/{questions.length}</p>
          <p className="text-xl mb-4">Total Time: {formatTime(timer)}</p>
          <button
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            onClick={resetQuiz}
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default TriviaForm;