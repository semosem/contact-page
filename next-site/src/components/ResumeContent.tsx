import { useState, useEffect } from "react";
import styles from "../styles/ResumeContent.module.css";

const resumeContent = [
  "Extensive expertise in diverse, team-oriented software engineering projects",
  "In-depth understanding of ReactJS, VueJS, NodeJS, and Angular, with a track record of developing robust applications in each.",
  "Complemeted for my git commits to be precise and well-documented, ensuring easy collaboration and maintenance.",
  "Expert at identifying and fixing bugs, with a proactive approach to problem-solving.",
  "Strong grasp of Component-based UIs, HTML DOM tree, render tree, and critical rendering path, ensuring optimal performance and user experience.",
  "8+ years of proven experience in building TypeScript and JavaScript web services and web development. Successfully led projects that improved system efficiency by 30%.",
  "Fast and efficient coding skills, consistently delivering high-quality work ahead of deadlines.",
  "My code is optimized for performance, resulting in fast and reliable applications.",
];

export default function ResumeContent({ sliderValue }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const index = Math.floor(sliderValue / (100 / resumeContent.length));
    setContent(resumeContent[index]);
  }, [sliderValue]);

  return (
    <div className={styles.resumeContent}>
      <p>{content}</p>
    </div>
  );
}
