import { useEffect, useRef } from "react";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    const drops = Array(columns).fill(1);

    function drawMatrixRain() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const intervalId = setInterval(drawMatrixRain, 33);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.layout}>
      <canvas ref={canvasRef} className={styles.matrixRain} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
