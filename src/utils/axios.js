import axios from 'axios';

var http = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
    baseURL: '',
})

http.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error);
})

http.interceptors.response.use(response => {
    const res = response.data;
    return response;
}, error => {
    return Promise.reject(error);
});

http.adornUrl = (url) => {
    return "http:localhost:8080/api";
}


/**
 * 封装请求
 */
http.methods = {
    base(url, data, method = "GET", contentType = 'form', autoMsg = false) {
        return new Promise((recover, reject) => {
            http({
                url: http.adornUrl(url),
                method,
                data: contentType == 'json' ? data : undefined,
                params: contentType == 'form' ? data : undefined
            }).then(({ data }) => {
                if (data.errorCode == 0) {
                    recover(data.result)
                    if (autoMsg) {
                        Message.success("操作成功");
                    }
                } else {
                    reject(data.errorMessage);
                    if (autoMsg) {
                        Message.error(data.errorMessage)
                    }
                }
            })
        });
    },
    get(url, params, autoMsg) {
        return this.base(url, params, 'GET', 'form', autoMsg);
    },
    post(url, params, autoMsg) {
        return this.base(url, params, "POST", 'form', autoMsg);
    },
    postBody(url, data, autoMsg) {
        return this.base(url, data, "POST", 'json', autoMsg);
    }
}

export default http