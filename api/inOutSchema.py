from pydantic import BaseModel, Field


class LatLngIn(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)