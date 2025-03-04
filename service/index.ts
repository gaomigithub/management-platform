import { ICommonResponse } from "@/types/common";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import Qs from "qs";

const API_SERVICES = {
  //   dolphin: '/jeecgdolphinapi',
  demo: "https://jzjv04.laf.run/",
} as const;

type ServiceType = keyof typeof API_SERVICES;

class HttpClient {
  private instance: AxiosInstance;
  private requestInterceptor: number | null = null;
  private responseInterceptor: number | null = null;

  constructor(info: { service: ServiceType; config?: any }) {
    this.instance = axios.create({
      baseURL: API_SERVICES[info.service],
      paramsSerializer: (params) =>
        Qs.stringify(params, { arrayFormat: "comma" }),
      ...info.config,
    });
  }

  // 设置拦截器
  private setupInterceptors(token: string) {
    // 清除现有拦截器
    if (this.requestInterceptor !== null) {
      this.instance.interceptors.request.eject(this.requestInterceptor);
    }
    if (this.responseInterceptor !== null) {
      this.instance.interceptors.response.eject(this.responseInterceptor);
    }

    // 请求拦截器
    this.requestInterceptor = this.instance.interceptors.request.use(
      async (config) => {
        if (token) {
          if (config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
            config.headers["X-Access-Token"] = token;
          } else {
            config.headers = {
              Authorization: `Bearer ${token}`,
              "X-Access-Token": token,
            } as unknown as AxiosRequestHeaders;
          }
        }

        // PATCH 请求的特殊处理
        if (config.method === "patch" && config.headers) {
          config.headers["Content-type"] = "application/json-patch+json";
        }

        // GET 请求参数编码处理
        if (config.method === "get" && config.params) {
          const reg = "\\?.*=.*";
          let url = config.url ?? "";
          url += (config.url ?? "").match(reg) ? "&" : "?";
          const keys = Object.keys(config.params);
          for (const key of keys) {
            if (config.params[key]) {
              url += `${key}=${encodeURIComponent(config.params[key])}&`;
            }
          }
          url = url.substring(0, url.length - 1);
          config.params = {};
          config.url = url;
        }
        return config;
      }
    );

    // 响应拦截器
    this.responseInterceptor = this.instance.interceptors.response.use(
      (response) => {
        if (response.data?.success === false) {
          //   message.error(response.data.message);
          console.error(response.data.message);
          return Promise.reject(new Error(response.data.message));
        }

        return response;
      },
      (error) => {
        if (error.response) {
          const { status } = error.response;
          console.info("%c%s", "color: red;", "API error.response", { status });
        }
        // message.error(error.response?.error);
        return Promise.reject(error);
      }
    );
  }

  // 更新 token 的方法
  public updateToken(newToken: string) {
    this.setupInterceptors(newToken);
  }

  async get<T>(url: string, params?: any): Promise<ICommonResponse<T>> {
    const response = await this.instance.get(url, { params });
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ICommonResponse<T>> {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ICommonResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, data?: any): Promise<ICommonResponse<T>> {
    const response = await this.instance.delete(url, data);
    return response.data;
  }
}

// export const dolphinHttp = new HttpClient("dolphin", {
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
// });

export const demoHttp = new HttpClient({
  service: "demo",
});
