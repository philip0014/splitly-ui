const BASE_URL = 'http://localhost:8080'

export const apiHelper = {
    get: (url, headers, callback, fallback) => {
        fetch(BASE_URL + url, {
                method: 'GET',
                headers: headers
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
    post: (url, headers, data, callback, fallback) => {
        if (headers === null || headers === undefined) {
            headers = {}
        }
        if (headers['Content-Type'] === null || headers['Content-Type'] === undefined) {
            headers['Content-Type'] = 'application/json'
            data = JSON.stringify(data)
        }

        fetch(BASE_URL + url, {
                method: 'POST',
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
    put: (url, headers, data, callback, fallback) => {
        if (headers === null || headers === undefined) {
            headers = {}
        }
        if (headers['Content-Type'] === null || headers['Content-Type'] === undefined) {
            headers['Content-Type'] = 'application/json'
            data = JSON.stringify(data)
        }

        fetch(BASE_URL + url, {
                method: 'PUT',
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
}