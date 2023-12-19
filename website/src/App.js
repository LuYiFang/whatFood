import React, { useEffect, useState } from "react";
import "./App.css";
import { Wheel } from "react-custom-roulette";
import _ from "lodash";
import Header from "./components/Header/Header";
import {
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { FetchApi } from "./utility/fetchApi";
import { api } from "./apiConfig";

function App() {
  const [data, setData] = useState([{ option: "" }]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(-1);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }, []);

  useEffect(() => {
    getRestaurants();
  }, [position]);

  const showPosition = (pos) => {
    setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  };

  const getRestaurants = async () => {
    const data = await FetchApi.get(api.restaurants + "/0/0");
    setData(_.map(data, (v) => ({ option: v })));
  };

  const handleSpin = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    setRestaurants((v) => [...v, data[prizeNumber].option]);
  };

  return (
    <div className="App">
      <Header />
      <Box sx={{ height: "calc( 100vh - 64px)" }}>
        <Container maxWidth="md" sx={{ height: "100%" }}>
          <Toolbar />
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" component="span">
                Eat{" "}
              </Typography>
              <Typography variant="h4" component="span">
                {_.last(restaurants)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <Wheel
                spinDuration={0.05}
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={[
                  "#730202",
                  "#F24405",
                  "#F2B705",
                  "#0E7364",
                  "#F29F05",
                ]}
                textColors={["#ffffff"]}
                onStopSpinning={handleSpinStop}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSpin}>
                Spin
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default App;
