import React, { useEffect, useState } from "react";
import "./App.css";
import { Wheel } from "react-custom-roulette";
import _ from "lodash";
import Header from "./components/Header/Header";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { FetchApi } from "./utility/fetchApi";
import { api } from "./apiConfig";

const RESTAURANT_LIST_KEY = "restaurant_list";

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
    let newData = sessionStorage.getItem(RESTAURANT_LIST_KEY);
    if (newData) {
      newData = JSON.parse(newData);
      setData(newData);
      return;
    }

    newData = await FetchApi.get(
      api.restaurants + `/${position.lat}/${position.lng}`,
    );
    newData = _.map(newData, (v) => ({ option: v }));

    setData(newData);
    sessionStorage.setItem(RESTAURANT_LIST_KEY, JSON.stringify(newData));
  };

  const handleSpin = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleSpinStop = () => {
    setMustSpin(false);

    let newRestaurants = [...restaurants, data[prizeNumber].option];
    if (restaurants.length >= 11) {
      newRestaurants = newRestaurants.slice(1);
    }
    setRestaurants(newRestaurants);
  };

  const deleteRestaurant = (restaurant) => {
    setRestaurants(_.without(restaurants, restaurant));
    setData(_.filter(data, (v) => v.option !== restaurant));
  };

  return (
    <div className="App">
      <Header />
      <Box sx={{ height: "calc( 100vh - 64px)" }}>
        <Container maxWidth="lg" sx={{ height: "100%" }}>
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
            <Grid item xs={4}></Grid>
            <Grid container item xs={4}>
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSpin}
                >
                  Spin
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              {_.map(restaurants, (restaurant, i) => {
                return (
                  <Box key={`restaurant-list-chip-${i}`} sx={{ mb: 1 }}>
                    <Chip
                      color="secondary"
                      label={restaurant}
                      onDelete={() => deleteRestaurant(restaurant)}
                    />
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default App;
