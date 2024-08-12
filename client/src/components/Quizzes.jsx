import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { IconButton, Tooltip, Alert, Fab } from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Footer from "./Footer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const Quizzes = ({ data }) => {
  const [quizData, setQuizData] = useState(null); // should be null
  const [loading, setLoading] = useState(true); // should be true
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!data) return;
      try {
        const response = await fetch("http://localhost:3000/generate-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(JSON.parse(result.text));
        setQuizData(JSON.parse(result.text));
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setError(error);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [data]);

  if (loading) {
    return (
      <div className="quizzes-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="quiz-load-error">
        <p>Error: Failed to load the quiz.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    console.log(quizData);
    // Check if all questions are answered
    if (quizData.every((item) => item.selectedAnswer !== undefined)) {
      setSubmitted(true);
      // Check if all answers are correct
      const allCorrect = quizData.every(
        (item) => item.answers[item.selectedAnswer].isCorrect
      );

      if (allCorrect) {
        setAllCorrect(true);
        confettiAnimation();
      } else {
        setAllCorrect(false);
      }
    } else {
      alert("Please answer all questions before submitting.");
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const updatedQuizData = quizData.map((item, idx) => {
      if (idx === questionIndex) {
        return {
          ...item,
          selectedAnswer: answerIndex,
        };
      }
      return item;
    });
    setQuizData(updatedQuizData);
  };

  return (
    <div className="quizzes">
      <div className="quizzes-banner">
        <div className="quizzes-banner-content">
          <h1 className="quizzes-banner-heading">
            Gemini Quiz
            <Tooltip title="save quiz">
              <IconButton>
                <BookmarkAddIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <p className="quizzes-banner-tagline">
            This quiz was generated using the Google Gemini AI model. It creates
            questions based on the content from the current course. Please note
            that there may be some inconsistencies in the quiz, including extra
            symbols or slight errors in the content.
          </p>
        </div>
        <div className="heading-banner-image">
          <img src="/images/quiz-banner.png" alt="quiz" />
        </div>
      </div>

      <ol className="quizzes-container">
        {quizData.map((item, index) => (
          <li key={index}>
            <RadioQuiz
              question={item.question}
              answers={item.answers}
              questionIndex={index}
              selectedAnswer={item.selectedAnswer}
              handleAnswerChange={handleAnswerChange}
              submitted={submitted}
            />
          </li>
        ))}
      </ol>

      <div className="submit-quiz">
        <Fab
          variant="extended"
          sx={{ fontFamily: "Poppins" }}
          size="small"
          onClick={handleSubmit}
        >
          Submit Answers
        </Fab>
      </div>
      <Footer />
      <CongratulationsModal
        open={allCorrect}
        onClose={() => setAllCorrect(false)}
      />
    </div>
  );
};

export default Quizzes;

const RadioQuiz = ({
  question,
  answers,
  questionIndex,
  selectedAnswer,
  handleAnswerChange,
  submitted,
}) => {
  const [value, setValue] = useState(selectedAnswer);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Select an option");

  const handleRadioChange = (event) => {
    const answerIndex = parseInt(event.target.value, 10);
    setValue(answerIndex);
    setError(false);
    setHelperText(" ");
    handleAnswerChange(questionIndex, answerIndex);
  };

  const isAnswerCorrect = submitted && answers[value]?.isCorrect;

  return (
    <div className="radio-quiz">
      <FormControl error={error} variant="standard">
        <div className="quiz-questions">
          <p className="quiz-radio-label" id="demo-error-radios">
            {question}
          </p>
          {submitted && (
            <div
              className={`quiz-correct-box ${
                isAnswerCorrect ? "answer-correct" : "answer-incorrect"
              }`}
            >
              <i
                className={`bx ${
                  isAnswerCorrect
                    ? "bx-check-circle bx-tada"
                    : "bx-x-circle bx-tada"
                }`}
              ></i>
              <p className="quiz-correct-text">
                {isAnswerCorrect ? "Correct" : "Incorrect"}
              </p>
            </div>
          )}
        </div>
        <RadioGroup
          aria-labelledby="demo-error-radios"
          name={`quiz-${questionIndex}`}
          value={value !== undefined ? value.toString() : ""}
          onChange={handleRadioChange}
        >
          {answers.map((ans, id) => (
            <div key={id}>
              <FormControlLabel
                value={id.toString()}
                control={<Radio size="small" />}
                label={<span className="radio-label">{ans.answer}</span>}
              />
              {submitted && ans.explanation && (
                <Alert
                  severity={ans.isCorrect ? "success" : "error"}
                  className="quiz-alert"
                >
                  {ans.explanation}
                </Alert>
              )}
            </div>
          ))}
        </RadioGroup>
        <FormHelperText className="quiz-radio-label">
          {helperText}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

const CongratulationsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontFamily: "Poppins" }}>Congratulations!</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontFamily: "Poppins" }}>
          You got all answers correct. Congratulations!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          sx={{ fontFamily: "Poppins" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function confettiAnimation() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 80,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

const customData = [
  {
    question: "What is the capital of France?",
    answers: [
      {
        answer: "Paris",
        isCorrect: true,
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        answer: "London",
        isCorrect: false,
        explanation: "London is the capital of England, not France.",
      },
      {
        answer: "Berlin",
        isCorrect: false,
        explanation: "Berlin is the capital of Germany, not France.",
      },
      {
        answer: "Madrid",
        isCorrect: false,
        explanation: "Madrid is the capital of Spain, not France.",
      },
    ],
  },
  {
    question: "What is the largest planet in our Solar System?",
    answers: [
      {
        answer: "Jupiter",
        isCorrect: true,
        explanation: "Jupiter is the largest planet in our Solar System.",
      },
      {
        answer: "Saturn",
        isCorrect: false,
        explanation: "Saturn is the second-largest planet, after Jupiter.",
      },
      {
        answer: "Earth",
        isCorrect: false,
        explanation:
          "Earth is the third planet from the Sun and is not the largest.",
      },
      {
        answer: "Mars",
        isCorrect: false,
        explanation: "Mars is smaller than Earth and Jupiter.",
      },
    ],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      {
        answer: "William Shakespeare",
        isCorrect: true,
        explanation:
          "'Romeo and Juliet' is a tragedy written by William Shakespeare.",
      },
      {
        answer: "Charles Dickens",
        isCorrect: false,
        explanation:
          "Charles Dickens was an English writer and social critic, not the author of 'Romeo and Juliet'.",
      },
      {
        answer: "Jane Austen",
        isCorrect: false,
        explanation:
          "Jane Austen was an English novelist known primarily for her six major novels, not 'Romeo and Juliet'.",
      },
      {
        answer: "Mark Twain",
        isCorrect: false,
        explanation:
          "Mark Twain was an American writer, humorist, entrepreneur, publisher, and lecturer, not the author of 'Romeo and Juliet'.",
      },
    ],
  },
  {
    question: "What is the boiling point of water at sea level?",
    answers: [
      {
        answer: "100°C",
        isCorrect: true,
        explanation: "Water boils at 100°C (212°F) at sea level.",
      },
      {
        answer: "0°C",
        isCorrect: false,
        explanation:
          "0°C is the freezing point of water, not the boiling point.",
      },
      {
        answer: "50°C",
        isCorrect: false,
        explanation: "50°C is not the boiling point of water at sea level.",
      },
      {
        answer: "150°C",
        isCorrect: false,
        explanation: "150°C is above the boiling point of water at sea level.",
      },
    ],
  },
];
