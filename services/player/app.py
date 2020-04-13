from flask import Flask
from flask import request
import requests
from flask_cors import CORS, cross_origin
from player_service import PlayerService

app = Flask(__name__)
cors = CORS(app, resources={
    r'/*': {'origins': "https://localhost:3000"}})
player_service = PlayerService()


@app.route('/player')
def player():
    authHeader = request.headers.get("Authorization")
    if authHeader is None:
        return 'bad request!', 400

    return player_service.get_player(authHeader)


@app.route('/play')
def play():
    authHeader = request.headers.get("Authorization")
    device_id = request.args.get('device_id')
    if authHeader is None:
        return 'bad request!', 400

    return player_service.play(authHeader, device_id)


@app.route('/pause')
def pause():
    authHeader = request.headers.get("Authorization")
    if authHeader is None:
        return 'bad request!', 400

    return player_service.pause(authHeader)


@app.route('/next')
def next():
    authHeader = request.headers.get("Authorization")
    if authHeader is None:
        return 'bad request!', 400

    return player_service.next(authHeader)


@app.route('/previous')
def previous():
    authHeader = request.headers.get("Authorization")
    if authHeader is None:
        return 'bad request!', 400

    return player_service.previous(authHeader)


@app.route('/shuffle')
def shuffle():
    authHeader = request.headers.get("Authorization")
    shuffle = request.args.get('shuffle')
    if authHeader is None:
        return 'bad request!', 400

    return player_service.shuffle(authHeader, shuffle)


@app.route('/repeat')
def repeat():
    authHeader = request.headers.get("Authorization")
    repeat = request.args.get('repeat')
    if authHeader is None:
        return 'bad request!', 400

    return player_service.repeat(authHeader, repeat)


app.run(port=6001)
