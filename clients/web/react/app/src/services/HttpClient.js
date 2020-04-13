export default class HttpClient {
  static async post(endpoint, headers, data, includeCredentials = false) {
    const response = includeCredentials
      ? await this.credentialsRequest(endpoint, data)
      : await this.request(endpoint, "POST", headers, data);
    return response;
  }
  static async put(endpoint, headers, data) {
    const response = await this.request(endpoint, "PUT", headers, data);
    return response;
  }
  static async get(endpoint, headers) {
    const response = await this.request(endpoint, "GET", headers);
    return response;
  }
  async delete(endpoint, headers) {
    const response = await this.request(endpoint, "DELETE", headers);
    return response;
  }
  static async request(endpoint, method, headers, data) {
    const requestData = data ? JSON.stringify(data) : null;
    var requestHeaders = {
      "Content-Type": "application/json"
    };
    if (headers) {
      headers.forEach(header => {
        var key = Object.getOwnPropertyNames(header);
        requestHeaders[key] = header[key];
      });
    }

    const response =
      method === "POST" || method === "PUT"
        ? await fetch(endpoint, {
            method: method,
            headers: requestHeaders,
            body: requestData
          })
        : await fetch(endpoint, {
            method: method,
            headers: requestHeaders
          });

    if (response.status > 200) {
      return null;
    }

    return response;
  }
  static async credentialsRequest(endpoint, data) {
    const requestData = data ? JSON.stringify(data) : null;
    var requestHeaders = {
      "Content-Type": "application/json"
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: requestHeaders,
      body: requestData,
      credentials: "include"
    });

    if (response.status > 200) {
      return null;
    }

    return response;
  }
}
