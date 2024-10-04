import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
// import Header from "../components/Header.tsx";
import ResumeContent from "../components/ResumeContent";
// import SkillPills from "../components/SkillPills";
// import Slider from "../components/Slider";
// import Terminal from "../components/Terminal";
// import CVIcon from "../components/CVIcon";
import SoundControl from "@/components/SoundControl";

export default function Home() {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  };

  return (
    <Layout>
      <Head>
        <title>Sem Gebresilassie: Software Development Professional</title>
        <meta
          name="description"
          content="Interactive resume of Sem Gebresilassie"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <ResumeContent sliderValue={sliderValue} />
      {/* <SkillPills />
      <Slider value={sliderValue} onChange={handleSliderChange} />
      <Terminal />
      <CVIcon /> */}
      <SoundControl />
    </Layout>
  );
}
