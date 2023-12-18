import React, { useEffect, useState } from "react";
import './App.css';
import { Wheel } from "react-custom-roulette";
import _ from "lodash";
import Header from "./components/Header/Header";


function App() {
  const [data, setData] = useState([{option: ""}])
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }, []);

  useEffect(() => {
    setData(_.map(_.range(10), (i) => {
      return { option: `${i}` };
    }));
  }, [position])

  const showPosition = (pos) => {
    setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  };

  return (
    <div className="App">
      <Header />
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={[
          "#402401",
          "#D99D55",
          "#A69B8D",
          "#BF8B5E",
          "#594F4F",
        ]}
        textColors={["#ffffff"]}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <button
        onClick={() => {
          const newPrizeNumber = Math.floor(Math.random() * data.length);
          setPrizeNumber(newPrizeNumber);
          setMustSpin(true);
        }}
      >
        Spin
      </button>
    </div>
  );
}

export default App;
