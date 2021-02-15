import React, {useState} from 'react';
import fetchQuizQuestions from "./API";

// components
import QuestionCard from "./components/QuestionCard";
// types
import {QuestionState, Difficulty, AnswerObject} from "./API";
// styles
import {GlobalStyle, Wrapper} from "./App.style";

const TOTAL_QUESTIONS: number = 10;

const App = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [scores, setScores] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(true);

    const startTrivia = async () => {
        setLoading(true);
        setGameOver(false);
        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASY
        );
        setQuestions(newQuestions);
        setScores(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);
    }

    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            // User's answer
            const answer = e.currentTarget.value;
            const correct = questions[number].correct_answer === answer;
            if (correct) {
                setScores(prev => prev + 1);
            }
            const answerObject: AnswerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer
            }
            setUserAnswers((prev) => [...prev, answerObject]);
        }
    }

    const nextQuestion = () => {
        const nextQuestion: number = number + 1;
        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setNumber(nextQuestion);
        }
    }

    return (
        <>
            <GlobalStyle/>
            <Wrapper>
                <h1>React Quiz</h1>
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button className="start" onClick={startTrivia}>Start</button>
                ) : null}
                {!gameOver ? <p className="score">Score: {scores}</p> : null}
                {loading && <p>Loading questions...</p>}
                {!loading && !gameOver && (
                    <QuestionCard
                        questionNumber={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[number].question}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={checkAnswer}
                    />
                )}
                {!gameOver &&
                !loading &&
                userAnswers.length === number + 1 &&
                number !== TOTAL_QUESTIONS - 1 && (
                    <button className="next" onClick={nextQuestion}>Next Question</button>
                )}
            </Wrapper>
        </>
    );
}

export default App;
