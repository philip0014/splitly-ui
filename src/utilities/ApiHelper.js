const BASE_URL = 'http://localhost:8080'

export const apiHelper = {
    fetchApi: (method, url, data, callback, fallback) => {
        fetch(BASE_URL + url, {
                method: method,
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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