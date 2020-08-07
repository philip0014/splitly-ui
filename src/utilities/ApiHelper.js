const BASE_URL = 'http://localhost:8080'

export const apiHelper = {
    execute: function (method, url, headers, data, callback, fallback) {
        fetch(BASE_URL + url, {
            method: method,
            headers: headers,
            body: data
        }).then(res => {
            return res.json();
        }).then(response => {
            if (response.code === 200) {
                callback(response.data);
            } else {
                fallback(response.error)
            }
        }).catch((error) => {
            fallback(error)
        });
    },
    get: function (url, headers, callback, fallback) {
        this.execute('GET', url, headers, null, callback, fallback)
    },
    post: function (url, headers, data, callback, fallback) {
        console.log(this)
        this.execute('POST', url, headers, data, callback, fallback)
    },
    put: function (url, headers, data, callback, fallback) {
        this.execute('PUT', url, headers, data, callback, fallback)
    },
}