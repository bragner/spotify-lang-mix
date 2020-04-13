import HttpClient from "./HttpClient";

// const access_token_key = "access_token";
// const refresh_token_key = "refresh_token";
// const expires_at_key = "expires_at";
const auth_endpoint = "https://localhost:5001/access";

let _access_token = null;
let _expires = null;

export default class AuthService {
  async login(code) {
    if (!code) {
      throw new Error("Code is required!");
    }

    const response = await HttpClient.post(
      `${auth_endpoint}/accessToken`,
      null,
      { code: code },
      true
    );

    if (!response) return false;

    const auth = await response.json();

    const dt = new Date();
    dt.setMinutes(dt.getMinutes() + 59);
    _access_token = auth.access_token;
    _expires = dt;

    return true;
  }
  async SSO() {
    const response = await HttpClient.post(
      `${auth_endpoint}/sso`,
      null,
      null,
      true
    );

    if (!response) return;

    const auth = await response.json();

    const dt = new Date();
    dt.setMinutes(dt.getMinutes() + 59);
    _access_token = auth.access_token;
    _expires = dt;

    return _access_token;
  }

  logout() {
    _access_token = null;
    _expires = null;
  }
  isAuthenticated() {
    const valid_expiry = new Date(_expires).getTime() > new Date().getTime();

    return valid_expiry;
  }

  async getAccessToken() {
    if (this.isAuthenticated()) {
      if (!_access_token) {
        throw new Error("Access token could not be found!");
      }

      return _access_token;
    } else {
      return await this.SSO();
    }
  }
}
