import React, { useEffect, useRef, useState, RefObject } from 'react'
import Moment from 'react-moment'

const cleanup = (magicstuf: any) => magicstuf

function PlayScreen({ quiz, allAnswered, setAllAnswered }) {
  const [activeQuestion, setActiveQuestion] = useState(quiz.randomQuestion) // start with a random question
  const [questionCount, setQuestionCount] = useState(1)
  const [grade, setGrade] = useState(0)
  const [timerOn, setTimerOn] = useState(true)
  const [timerStart] = useState(42)
  const [timerTime, setTimerTime] = useState(timerStart)
  const choicesRef: RefObject<any> = useRef()

  const { category, difficulty, question } = activeQuestion

  let gradingTimeout: any

  function handleGrading(selectedAnswer: string) {
    const correctAnswer = quiz.answer(activeQuestion.id)
    // // find the possible answers/choices for questions on DOM
    const choiceButtons = [...choicesRef.current.children]
    const selectedChoiceButton = choiceButtons?.filter(
      (c) => c.innerText === selectedAnswer
    )[0]
    const rightChoiceButton = choiceButtons?.filter(
      (c) => c.innerText === correctAnswer
    )[0]
    // change background of correct answer to green
    rightChoiceButton.style.backgroundColor = 'green'
    clearTimeout(gradingTimeout)
    // freeze the timer
    setTimerOn(false)

    // do what you will if answer is correct, else incorrect
    if (selectedAnswer === correctAnswer) {
      // correct
      // console.log('answered correctly')
      let score: number
      switch (difficulty) {
        case 'hard':
          score = 12
          break
        case 'medium':
          score = 7
          break
        default:
          score = 3
      }
      setGrade(score)
    } else {
      // incorrect
      if (selectedChoiceButton) {
        // only if a choice was actually selected
        // change background of incorrect answer to red
        selectedChoiceButton.style.backgroundColor = 'red'
      }
      // console.log('answered incorrectly')
      setGrade(-10)
    }
    // set timeout to display wrong/right answer
    gradingTimeout = window.setTimeout(() => {
      // break if all questions have been answered
      if (quiz.alreadyAnswered.length !== quiz.questions.length) {
        setTimerTime(timerStart)
        // restart countdown
        setTimerOn(true)
        // set a new random question
        setActiveQuestion(quiz.randomQuestion)
        setQuestionCount(quiz.alreadyAnswered.length + 1)
      } else {
        setAllAnswered(true)
      }
    }, 2000)
  }

  // mount/dismount of component
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanup(clearTimeout(gradingTimeout)), [])

  return (
    <>
      <style jsx>
        {`
          .activeQuestion h2 {
            color: #ffffff;
            text-align: center;
            padding: 1rem;
          }
          header {
            background-color: #0003;
            color: var(--main-color, blue);
            text-align: center;
            margin: auto;
            margin-bottom: 2.441rem;
            width: 80%;
            max-width: 576px;
          }

          article {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
          article .card {
            flex: 0.8 1 300px;
            margin: 0.25rem;
            padding: 1.5rem;

            font-weight: bolder;
            font-size: var(--heading-3);
            text-align: center;
            color: inherit;
            text-decoration: none;

            border: 1px solid transparent;
            border-radius: 4px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .grade {
            font-weight: 700;
            font-size: var(--heading-3);
          }
          .timer-block {
            min-height: 75px;
            width: 100%;
            background-color: #ffffff00;
          }
          .countdown-timer,
          .question-count,
          .grade-display {
            color: #fff;
            font-weight: 800;
            font-size: var(--heading-1);
            padding: 0.5rem 1rem;
            margin: 0 1.3rem;
          }
        `}
      </style>
      <header>
        <h1>{category || 'Category Name'}</h1>
        <p className={`${difficulty}`}>{difficulty || 'Category Difficulty'}</p>
      </header>
      <div className="timer-block gentle-flex-centered">
        {/* quick patch for a working "countdown timer"
        uses moment (react-moment) */}
        <Moment
          element="span"
          className="time"
          style={{ display: 'none' }}
          format="YYYY"
          onChange={() => {
            if (!timerOn) return
            setTimerTime(timerTime === 0 ? timerTime : timerTime - 1)
            if (timerTime === 0) {
              handleGrading('no')
            }
          }}
        />
        <div>
          <span className="question-count">
            Q: {questionCount} / {quiz.questions.length}
          </span>
          <span
            style={{ color: `${timerTime <= 10 && 'red'}` }}
            className="countdown-timer"
          >
            ⏲ {timerTime}
          </span>
          <span className="grade-display">{grade}</span>
        </div>
      </div>

      <div className="playScreen container">
        {activeQuestion && !allAnswered && (
          <section className="activeQuestion">
            <h2>{question}</h2>
            <article ref={choicesRef}>
              {activeQuestion.choices.map((choice: string) => (
                <button
                  disabled={timerTime <= 0 || !timerOn}
                  type="button"
                  key={choice}
                  onClick={(e) => handleGrading(e.currentTarget.value)}
                  className="card choices"
                  value={choice}
                >
                  {choice}
                </button>
              ))}
            </article>
          </section>
        )}
      </div>
    </>
  )
}

export default PlayScreen
