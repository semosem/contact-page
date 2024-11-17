import React, { useState } from "react";

const Slider: React.FC = () => {
  const [sliderValue, setValue] = useState(50);

  // Update value on slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="relative w-full mt-10 flex justify-center items-center">
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg cursor-pointer focus:outline-none"
      />
    </div>
  );
};

export default Slider;
