import axios from 'axios';


const STATUS_TIPS_TEXT_MAP: any = {
    500: '网络连接错误，请稍后重试',
    504: '请求超时，请稍后重试',
};
// http response 拦截器
axios.interceptors.response.use(
    (response: any) => {
        const { data } = response;
        const { isSilent, isSkipDefaultHandler } = response.config;
        const { retCode, retDesc } = data;

        if (isSkipDefaultHandler) {
            return response;
        }
        if (Number(retCode) !== 200) {
            if (!isSilent) {
                console.log(retDesc || '请求失败');
            }
            return Promise.reject(data.data || {});
        }
        return data.data || {};
    },
    (error) => {
        const { isSilent } = error.config;
        if (!isSilent) {
            const status = error.response.status;
            console.log(STATUS_TIPS_TEXT_MAP[status] || '请求失败');
        }
        return Promise.reject(error);
    },
);
