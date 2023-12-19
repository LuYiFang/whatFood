import axios from "axios";
import { Alert } from "./alert";

export class FetchApi {
  static async callApi(url, method, data = {}, config = {}) {
    try {
      const res = await axios({
        url: url,
        method: method,
        data: data,
        ...config,
      });

      if (res.status !== 200) {
        Alert.error();
        throw new Error();
      }
      return res.data;
    } catch (error) {
      Alert.error(error.message);
      throw new Error(error.message);
    }
  }

  static async get(url, data = {}, config = {}) {
    const searchStr = new URLSearchParams(data).toString();
    url = url + "?" + searchStr;
    return await this.callApi(url, "get", {}, config);
  }

  static async post(url, data = {}, config = {}) {
    return await this.callApi(url, "post", data, config);
  }
}
