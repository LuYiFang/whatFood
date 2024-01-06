import logging
import os

import googlemaps
import toml
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from inOutSchema import LatLngIn

config = toml.load('config.toml')

app = FastAPI()

origins = config['origins']
static_web_path = config['static_web_path']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type"],
)

app.mount("/app", StaticFiles(directory=static_web_path), name="static")

GOOGLE_MAP_KEY = config['google']['map_key']
gmaps = googlemaps.Client(key=GOOGLE_MAP_KEY)


@app.get("/api")
def read_root():
    return {"Hello": "World"}


@app.get("/api/restaurants/{lat}/{lng}")
def find_restaurants(params: LatLngIn = Depends()):
    try:
        restaurants = gmaps.places_nearby(
            {'lat': params.lat, 'lng': params.lng},
            type="restaurant", radius=5000, language="zh-TW", open_now=True
        )['results']
    except Exception as e:
        msg = 'Google map api error'
        logging.info(f'{msg}: {e}')
        raise HTTPException(status_code=500, detail=msg)

    return [restaurant['name'] for restaurant in restaurants]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
