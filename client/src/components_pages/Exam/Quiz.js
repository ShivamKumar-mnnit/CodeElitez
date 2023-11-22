import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Question from './Question';
import CountDownTimer from '../../components_pages/elements/CountDownTimer';
import { useParams, useNavigate } from 'react-router-dom';

export default function Quiz() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const userexamid = state?.userexamid;
  console.log(userexamid);

  const token = localStorage.getItem('token');
  const [time, setTime] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionMarks,setQuestionMarks] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState('');
  const [selected, setSelected] = useState();

  const [qt,setQt]=useState("");
const [score,setScore] = useState(0);


  const params = useParams();
  const id = params;

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/exam/exam/${id.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(data.examQuestions);
      setTime(data.time);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };








const handleReview = () => {
 
    const userOptions = {
      examReview: {
        qAnswers: selected,
        qCorrect: correct,
        qTitle: qt,
      }
    };
    console.log(userOptions)
    axios.put(`http://localhost:8080/userexams/${userexamid}`, userOptions,{ headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      console.log(response.status);
      console.log(response.data);
    });
  
}




const handleScore = () => {
  // Calculate the final score or perform any final actions before submitting the score

  const finalScore = score;
  
  // Create payload for submitting final score
  const scorePayload = {
    score: finalScore // Assuming the API requires the final score in this format
  };
console.log(userexamid);
  axios.put(`http://localhost:8080/userexams/score/${userexamid}`, scorePayload, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((response) => {
    if (response.status === 200) {
      console.log("Final score submitted successfully:", response.data);
      // Perform any actions after successful submission
    } else {
      console.log("Submission failed with status:", response.status);
      // Handle failure scenarios if needed
    }
  })
  .catch((error) => {
    console.error("Error submitting final score:", error);
    // Handle error scenarios
  });
};





  const handleNextQuestion = () => {
    if(selected!==undefined && selected!=='' && selected===correct){
      setScore((prevscore)=>prevscore+questionMarks);
      setSelected();
    }
    handleReview();
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };
  const handleSubmit=()=>{
    handleScore();
    alert("Your Exam hasbeen finished");
    navigate('/');
  }
  


  if (loading) {
    return <>Loading...</>;
  }

  const hoursMinSecs = { hours: 0, minutes: time, seconds: 0 };


  return (
    <div className="container backgroundimagesetter">
      <CountDownTimer hoursMinSecs={hoursMinSecs} handleTimerEnd={handleSubmit} />
      <h1 className="title text-dark text-center mt-5 mb-4">Quiz Application</h1>
      {currentQuestionIndex < questions.length ? (
        <div className="text-center">
          <Question
            qid={questions[currentQuestionIndex]}
            qno={currentQuestionIndex}
            // score={score}
            // setScore={setScore}
            // qtotal={questions.length}
            selected={selected}
            setSelected={setSelected}
            correct={correct}
            setCorrect={setCorrect}
            questionMarks={questionMarks}
            setQuestionMarks={setQuestionMarks}
            qt={qt}
            setQt={setQt}

          />
          <div className="text-center mt-4 py-3">
            <button className="btn btn-success" onClick={handleNextQuestion}>

{
  (currentQuestionIndex) === (questions.length-1)? <>
  
  
  
  submit
  
  
  </> : <>Next</>
}


            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4 py-3">
          <p className='my-2'>All questions answered!</p>
          <p className='my-2'>Temporary Score : <span className='fw-bold'>{score}</span></p>
          <button className='btn btn-success' onClick={handleSubmit}>Final Submit the Exam</button>
          
        </div>
      )}
    </div>
  );
}
