"use client";
// import Image from "next/image";
import Terminal from "@/components/terminal";
import { LinkedIn, Github } from "@/components/icons";
import MatrixSlider from "@/components/slider"; // Import the MatrixSlider

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20">
      <main className="w-full flex flex-col gap-8  items-center sm:items-start">
        <Terminal />
        <MatrixSlider />
      </main>

      <footer className="row-start-3 flex gap-2 flex-wrap items-center justify-end w-full">
        <a
          className="flex items-center"
          href="https://github.com/semosem"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>
        <a
          className="flex items-center"
          href="https://www.linkedin.com/in/semgebresilassie/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn />
        </a>
      </footer>
    </div>
  );
}
