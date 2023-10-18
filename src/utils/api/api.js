import http from './http';
import config from "@/config";

const api = {
    // get
    sleep: async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time);
        })
    },

    getSymbols: (params) => {
        return http.get(params, "/get_all_symbols");
    },

    getSymbolBar: (params) => {
        return http.get(params, "/get_kline");
    },

    checkUser: (params) => {
        return http.get(params, "/home/checkUser");
    },
    getAddressList: (params) => {
        return http.get(params, "/home/getAddressList");
    },

    // post
    checkSign: (params) => {
        return http.post(params, "/home/checkSign");
    },
}
export default api
