import ButtonGradient from "./assets/svg/ButtonGradient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";

import Roadmap from "./components/Roadmap";

import Upload from "./components/uploads";
import PredictionDisplay from "./components/PredictionDisplay";

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Roadmap />
        <Upload />
        <PredictionDisplay />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
