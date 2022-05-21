import axios, { AxiosInstance } from "axios";

interface IAxiosManager {
  post: (path: string, data?: object) => object;
}

class AxiosManager implements IAxiosManager {
  private baseUrl: string;
  private instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.accessToken = "";
    this.refreshToken = "";

    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        refresh: this.refreshToken,
      },
    });
  }

  createInstance() {
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        refresh: this.refreshToken,
      },
    });

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === 401 && error.response.data.expire) {
          const newAccessTokenResult = await this.instance.get("/auth/refresh");
          const { accessToken, refreshToken } = newAccessTokenResult.data.data;
          this.setToken(accessToken, refreshToken);
          this.createInstance();
          return this.instance.request(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setToken(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async post(path: string, data = {}) {
    let result;
    try {
      result = await this.instance.post(path, data);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
    return result;
  }

  async get(path: string, params = {}) {
    let result;
    try {
      result = await this.instance.get(path, { params });
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
    return result;
  }

  async delete(path: string, data = {}) {
    let result;
    try {
      result = await this.instance.delete(path, { data });
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
    return result;
  }

  async patch(path: string, data = {}) {
    let result;
    try {
      result = await this.instance.patch(path, data);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
    return result;
  }

  async postImage(path: string, data: any) {
    let result;
    try {
      result = await axios.post(
        `${this.baseUrl}${path}`,
        { ...data },
        {
          headers: { ...data.getHeaders() },
        }
      );
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
    return result;
  }
}

export default new AxiosManager(process.env.serverURL!);
