import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Wheel } from "react-custom-roulette";
import _ from "lodash";
import Header from "./components/Header/Header";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Grid,
  List,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { styled } from "@mui/material/styles";
import { FetchApi } from "./utility/fetchApi";
import { api } from "./apiConfig";
import { createCsv, createExcel, handleFileUpdate } from "./utility/utility";

const RESTAURANT_LIST_KEY = "restaurant_list";
const MAX_OPTIONS_LENGTH = 5;

function App() {
  const [data, setData] = useState([{ option: "" }]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(-1);
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [restaurants, setRestaurants] = useState([]);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const uploadFormRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }, []);

  useEffect(() => {
    if (position.lat === null || position.lng === null) return;
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
      setData(formatRestaurants(newData));
      return;
    }

    newData = await FetchApi.get(
      api.restaurants + `/${position.lat}/${position.lng}`,
    );

    setData(formatRestaurants(newData));
    sessionStorage.setItem(RESTAURANT_LIST_KEY, JSON.stringify(newData));
  };

  const formatRestaurants = (newData) => {
    return _.map(newData, (v) => {
      let displayOption = v;

      if ((v || "").length > MAX_OPTIONS_LENGTH) {
        displayOption = v.slice(0, MAX_OPTIONS_LENGTH) + "...";
      }

      return {
        option: displayOption,
        fullOptions: v,
      };
    });
  };

  const handleSpin = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleSpinStop = () => {
    setMustSpin(false);

    let newRestaurants = [...restaurants, data[prizeNumber].fullOptions];
    if (restaurants.length >= 11) {
      newRestaurants = newRestaurants.slice(1);
    }
    setRestaurants(newRestaurants);
  };

  const deleteRestaurant = (restaurant) => {
    setRestaurants(_.without(restaurants, restaurant));
    setData(_.filter(data, (v) => v.fullOptions !== restaurant));
  };

  const handleUploadRestaurants = async (e) => {
    const uploadData = await handleFileUpdate(e.target.files[0]);
    uploadFormRef.current.reset();

    if (!uploadData) return;

    setData(formatRestaurants(uploadData));
  };

  const handleDownloadRestaurants = async (downloadFormat) => {
    const downloadData = _.map(data, (v) => [v.fullOptions]);
    const filename = "restaurants";

    if (downloadFormat === "csv") {
      createCsv(filename, downloadData);
      return;
    }

    createExcel(filename, { restaurants: downloadData });
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
            <Grid
              item
              lg={3}
              sm={12}
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                sx={{
                  maxWidth: 260,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Stack>
                  <form
                    method="post"
                    action=""
                    encType="multipart/form-data"
                    ref={uploadFormRef}
                  >
                    <Button
                      component="label"
                      variant="contained"
                      sx={{ mb: 1, width: "100%" }}
                      startIcon={<CloudUploadIcon />}
                      onChange={handleUploadRestaurants}
                    >
                      Upload Restaurants
                      <VisuallyHiddenInput type="file" />
                    </Button>
                  </form>
                </Stack>

                <Stack>
                  <Button
                    variant="contained"
                    sx={{ width: "100%" }}
                    startIcon={<CloudDownloadIcon />}
                    onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                  >
                    Download Restaurants
                  </Button>
                  <Collapse in={isDownloadOpen} timeout="auto" unmountOnExit>
                    <List>
                      <ListItemButton
                        onClick={() => handleDownloadRestaurants("csv")}
                      >
                        csv
                      </ListItemButton>
                      <ListItemButton
                        onClick={() => handleDownloadRestaurants("excel")}
                      >
                        excel
                      </ListItemButton>
                    </List>
                  </Collapse>
                </Stack>
              </Box>
            </Grid>
            <Grid container item lg={6} sm={12} xs={12}>
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
                  pointerProps={{
                    style: {
                      filter: "hue-rotate(75deg)",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSpin}
                  disabled={mustSpin}
                >
                  Spin
                </Button>
              </Grid>
            </Grid>
            <Grid item lg={3} sm={12} xs={12} mb={4}>
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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
