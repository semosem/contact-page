import { useState, useEffect, useRef } from "react";
import styles from "../styles/SoundControl.module.css";

export default function SoundControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/bird-chirp.wav");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Error playing audio:", e);
        alert(
          "There was an error playing the audio. Please check your browser settings or try again."
        );
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.controlContainer}>
      <button
        className={`${styles.soundButton} ${isPlaying ? styles.playing : ""}`}
        onClick={toggleSound}
      >
        {isPlaying ? "🔇" : "🐦🌿"}
      </button>
    </div>
  );
}
