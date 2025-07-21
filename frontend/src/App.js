import React, { useState, useEffect, useRef } from 'react';

const movies = [
  {
    title: "Bahubali",
    image: "/posters/bahubali.jpg",
    clue: "A king born in a tribal village."
  },
  {
    title: "Eega",
    image: "/posters/eega.jpg",
    clue: "Hero reincarnated as an insect."
  },
  {
    title: "Pushpa",
    image: "/posters/pushpa.jpg",
    clue: "Red sandalwood smuggler."
  },
  {
    title: "RRR",
    image: "/posters/rrr.jpg",
    clue: "Two revolutionaries fight against the British Raj."
  },
  {
    title: "Hi Nanna",
    image: "/posters/hi-nanna.jpg",
    clue: "Emotional drama between father and daughter."
  },
  {
    title: "Hit 3",
    image: "/posters/hit-3.jpg",
    clue: "Crime investigation thriller."
  }
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [movieList, setMovieList] = useState(shuffleArray(movies));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [blurLevel, setBlurLevel] = useState(15);
  const [hintStage, setHintStage] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(20);
  const timerRef = useRef(null);

  const currentMovie = movieList[currentIndex];

  const playSound = (type) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play();
  };

  const resetRound = () => {
    setCurrentIndex(prev => prev + 1);
    setMessage("");
    setGuess("");
    setBlurLevel(15);
    setHintStage(0);
    setTimer(20);
  };

  useEffect(() => {
    if (gameOver || currentIndex >= movieList.length) return;

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          setMessage("⏱️ Time's up!");
          playSound("wrong");
          setTimeout(() => resetRound(), 1500);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, gameOver]);

  // ✅ Play win sound only once when game is over
  useEffect(() => {
    if (gameOver) {
      playSound("win");
    }
  }, [gameOver]);

  const handleGuess = () => {
    if (guess.trim().toLowerCase() === currentMovie.title.toLowerCase()) {
      setMessage("✅ Correct!");
      playSound("correct");
      const newScore = score + 1;
      setScore(newScore);
      clearInterval(timerRef.current);

      if (newScore >= 6) {
        setGameOver(true); // ✅ win sound now plays from useEffect
      } else {
        setTimeout(() => resetRound(), 1000);
      }
    } else {
      setMessage("❌ Wrong! Try again.");
      playSound("wrong");
    }
  };

  const handleHint = () => {
    if (hintStage < 3) {
      setHintStage(hintStage + 1);
      setBlurLevel(prev => Math.max(0, prev - 5));
    }
  };

  const renderHint = () => {
    const clue = currentMovie.clue;
    if (hintStage === 0) return null;
    if (hintStage === 1) return <p><strong>Hint:</strong> {clue.slice(0, 15)}...</p>;
    if (hintStage === 2) return <p><strong>Hint:</strong> {clue.slice(0, 30)}...</p>;
    return <p><strong>Hint:</strong> {clue}</p>;
  };

  if (gameOver || currentIndex >= movieList.length) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h1>🎉 Game Over!</h1>
        <p>Your Score: {score}/6</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", paddingTop: "40px" }}>
      <h1>Guess the Telugu Movie 🎬</h1>

      <p style={{ fontSize: "18px" }}>⏱️ Time Left: <strong>{timer}</strong> sec</p>

      <img
        src={currentMovie.image}
        alt="Movie Poster"
        style={{
          width: "300px",
          height: "auto",
          margin: "20px",
          filter: `blur(${blurLevel}px)`,
          transition: "filter 0.5s ease"
        }}
      />

      <div>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter movie name"
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px",
            borderRadius: "5px"
          }}
        />
        <button
          onClick={handleGuess}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Submit
        </button>
      </div>

      <p style={{ fontWeight: "bold", marginTop: "20px" }}>{message}</p>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleHint}
          style={{
            padding: "8px 16px",
            backgroundColor: "#444",
            color: "#fff",
            borderRadius: "4px",
            border: "none"
          }}
        >
          Show Hint 🔍
        </button>
        {renderHint()}
      </div>

      <p style={{ marginTop: "30px" }}>Score: {score}/6</p>
    </div>
  );
}

export default App;
