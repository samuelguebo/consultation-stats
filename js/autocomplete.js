const AutoComplete = {
    wikis: () => {
        if ( typeof(window.wikis) === "undefined" ){
        
            let apiURI = 'https://en.wikipedia.org/w/api.php?action=sitematrix&smtype=language&format=json&origin=*'

            return fetch(apiURI)
            .then(response => response.json())
            .then(data => {
                // flatten array
                data = Object.values(data.sitematrix)
                window.wikis = data.reduce((a, b) => a.concat(b.site), []);
                return window.wikis
            })

        }else {
            return Promise.resolve(window.wikis)
        }
    }
}