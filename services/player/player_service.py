import requests
import json


class PlayerService:

    endpoint = "https://api.spotify.com/v1/me/player"

    def get_player(self, auth):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.get(
            self.endpoint + "/currently-playing", headers=headers)
        return response.text

    def play(self, auth, device_id=""):
        headers = {'Authorization': 'Bearer ' + auth}

        if(device_id != ""):
            data = {'device_ids': [device_id], 'play': True}
            response = requests.put(
                self.endpoint, headers=headers, json=data)
            return ""
        else:
            response = requests.put(
                self.endpoint + "/play", headers=headers)
            return response.text

    def pause(self, auth):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.put(
            self.endpoint + "/pause", headers=headers)
        return response.text

    def next(self, auth):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.post(
            self.endpoint + "/next", headers=headers)
        return response.text

    def previous(self, auth):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.post(
            self.endpoint + "/previous", headers=headers)
        return response.text

    def shuffle(self, auth, shuffle):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.put(
            self.endpoint + "/shuffle?state=" + shuffle, headers=headers)
        return response.text

    def repeat(self, auth, repeat):
        headers = {'Authorization': 'Bearer ' + auth}
        response = requests.put(
            self.endpoint + "/repeat?state=" + repeat, headers=headers)
        return response.text
