"use client";
import React, { useState, useEffect, useRef } from "react";
import SkillPills from "@/components/skillPills";
import Tooltip from "@/components/tooltip";

interface TerminalHistory {
  command: string;
  response: string;
  type: "command" | "response" | "skill";
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]); // Run this effect every time `history` changes

  const handleCommand = (command: string) => {
    let response = "";

    switch (command) {
      case "help":
        response = "Available commands: help, skills, projects, contact, clear";
        break;
      case "skills":
        response =
          "JavaScript, TypeScript, React, Vue.js, Node.js, Angular, HTML5, CSS3, Git, RESTful APIs, GraphQL, SQL, NoSQL";
        break;
      case "projects":
        response = "https://github.com/semosem?tab=repositories";
        break;
      case "contact":
        response = "Contact: dwell.sem@gmail.com";
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        response =
          "Command not recognized. Type 'help' for available commands.";
    }

    setHistory((prev) => [...prev, { command, response, type: "response" }]);
  };

  const handleSkillSelect = (skill: string) => {
    const response = generateSkillResponse(skill);
    setHistory((prev) => [
      ...prev,
      {
        command: `skill --explore ${skill}`,
        response,
        type: "skill",
      },
    ]);
  };

  type Skill = {
    yearsActive: number;
    relatedSkills: string[];
    recentUsage: "Active" | "Occasional";
  };

  type SkillsMap = {
    [key: string]: Skill;
  };

  const skills: SkillsMap = {
    JavaScript: {
      yearsActive: 10,
      relatedSkills: ["TypeScript", "React", "Node.js"],
      recentUsage: "Active",
    },
    TypeScript: {
      yearsActive: 7,
      relatedSkills: ["JavaScript", "React"],
      recentUsage: "Active",
    },
    ReactJs: {
      yearsActive: 7,
      relatedSkills: ["JavaScript", "TypeScript", "Node.js"],
      recentUsage: "Active",
    },
    CSS3: {
      yearsActive: 7,
      relatedSkills: ["JavaScript", "TypeScript", "Node.js"],
      recentUsage: "Active",
    },
    AI: {
      yearsActive: 2,
      relatedSkills: ["Python", "Machine Learning", "Data Science"],
      recentUsage: "Occasional",
    },
    NodeJS: {
      yearsActive: 5,
      relatedSkills: ["JavaScript", "Express", "TypeScript"],
      recentUsage: "Active",
    },
    Git: {
      yearsActive: 10,
      relatedSkills: ["GitHub", "CI/CD", "Version Control"],
      recentUsage: "Active",
    },

    default: {
      yearsActive: 8,
      relatedSkills: ["General Development Skills"],
      recentUsage: "Occasional",
    },
  };

  const experienceLevel = [
    "Novice",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master",
  ];

  const generateSkillResponse = (skill: string): string => {
    const skillData = skills[skill] || skills.default;

    const level =
      experienceLevel[
        Math.min(skillData.yearsActive, experienceLevel.length - 1)
      ];

    return `
[INFO] Analyzing Skill: ${skill}
============================
Experience Level: ${level}
Years: ${skillData.yearsActive}+
Recent Usage: ${skillData.recentUsage}
Related Skills: ${skillData.relatedSkills.join(", ")}
  `;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    setHistory((prev) => [...prev, { command, response: "", type: "command" }]);
    handleCommand(command);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 left-4 w-96 h-64 bg-black border border-green-500 rounded-lg overflow-hidden font-mono text-sm">
      <SkillPills onSelectSkill={handleSkillSelect} />
      <div className="h-6 bg-green-900 px-2 flex items-center justify-between">
        <span className="text-green-300">Terminal</span>
        <Tooltip text="Oh, this isn't interative really :(">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </Tooltip>
      </div>

      <div
        ref={terminalRef}
        className="h-[calc(100%-3rem)] overflow-y-auto p-2 text-green-500"
      >
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.type === "command" && (
              <div className="flex items-center gap-2">
                <span className="text-green-700">$</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.type === "response" && (
              <div className="whitespace-pre-wrap ml-4 text-green-200">
                {entry.response}
              </div>
            )}
            {entry.type === "skill" && (
              <div className="whitespace-pre-wrap ml-4 text-green-400">
                {entry.response}
              </div>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-white">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-500 p-0 m-0 border-green-500"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
