from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_restaurants():
    res = client.get('/api/restaurants/25.0341/121.5640')
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_restaurants_invalid_lat():
    res = client.get('/api/restaurants/90.5/121.5640')
    assert res.status_code == 422


def test_restaurants_invalid_lng():
    res = client.get('/api/restaurants/25.0341/-190')
    assert res.status_code == 422
