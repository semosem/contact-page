import React from "react";

interface SkillPillsProps {
  onSelectSkill: (skill: string) => void;
}

const skills = [
  "JavaScript",
  "TypeScript",
  "ReactJs",
  "VueJs",
  "NodeJs",
  "AI",
  "HTML5",
  "GraphQl",
  "CSS3",
  "Git",
  "RESTful APIs",
  "SQL",
];

const SkillPills: React.FC<SkillPillsProps> = ({ onSelectSkill }) => {
  return (
    <div className="fixed top-4 left-4 flex flex-wrap gap-2 max-w-xs">
      {skills.map((skill) => (
        <span
          key={skill}
          onClick={() => onSelectSkill(skill)}
          className="px-2 py-1 text-xs text-green-500 border border-green-500 bg-transparent rounded-full cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:text-white hover:shadow-[0px_0px_8px_#00FF00,0px_0px_12px_#00FF00,0px_0px_16px_#00FF00]"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillPills;
