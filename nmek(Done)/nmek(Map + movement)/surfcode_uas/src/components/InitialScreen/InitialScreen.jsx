import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InitialScreen.module.css";
import avatar1 from "../../assets/avatars/Avatar 1.png";
import avatar2 from "../../assets/avatars/Avatar 2.png";
import avatar3 from "../../assets/avatars/Avatar 3.png";

const avatars = [
  { id: "avatar1", src: avatar1, alt: "Avatar 1" },
  { id: "avatar2", src: avatar2, alt: "Avatar 2" },
  { id: "avatar3", src: avatar3, alt: "Avatar 3" },
];

const InitialScreen = ({ onStart }) => {
  const [name, setName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const startGame = () => {
    navigate('/map');
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    setProgress(0);

    // Simple progress animation without useEffect
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;

        if (newProgress >= 100) {
          clearInterval(interval);

          // Call onStart immediately when done
          const playerData = {
            name: name.trim(),
            avatar: avatars[selectedIndex].id,
          };

          if (onStart) {
            onStart(playerData);
          }

          return 100;
        }

        return newProgress;
      });
    }, 50);
  };

  const nextAvatar = () => {
    setSelectedIndex(prev => (prev + 1) % avatars.length);
  };

  const prevAvatar = () => {
    setSelectedIndex(prev => (prev - 1 + avatars.length) % avatars.length);
  };

  const getLoadingText = (currentProgress) => {
    if (currentProgress < 25) return "Preparing adventure...";
    if (currentProgress < 50) return "Loading islands...";
    if (currentProgress < 75) return "Setting up explorations...";
    return "Almost ready...";
  };

  useEffect(() => {
    if (progress === 100) {
      // Optional: add a slight delay for smoother UX
      setTimeout(() => {
        navigate('/map');
      }, 300);
    }
  }, [progress, navigate]);



  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <h2 className={styles.pixelTitle}>LOADING...</h2>

        <div className={styles.pixelBox}>
          <div className={styles.pixelFrame}>
            <div
              className={styles.pixelBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.pixelPercentage}>{Math.floor(progress)}%</div>
        </div>

        <div className={styles.pixelText}>{getLoadingText(progress)}</div>
      </div>
    );
  }

  return (
    <div className={styles.screenContainer}>
      <div className={styles.header}>
        <i className="bxr bx-plane-land">✈️</i>
        <h1>🍺Tavern Life Simulator🍺</h1>
      </div>
      <hr className={styles.separator} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.avatarSection}>
          <button type="button" className={styles.arrowButton} onClick={prevAvatar}>
            ←
          </button>
          <img
            src={avatars[selectedIndex].src}
            alt={avatars[selectedIndex].alt}
            className={styles.avatarImage}
          />
          <button type="button" className={styles.arrowButton} onClick={nextAvatar}>
            →
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          maxLength={15}
        />

        <button
          type="submit"
          className={`${styles.startButton} ${!name.trim() ? styles.disabled : ""}`}
          disabled={!name.trim()}
        >
          Start Exploring
        </button>
      </form>
    </div>
    
  );

};

export default InitialScreen;