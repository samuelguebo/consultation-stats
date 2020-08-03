const WikiRepository = {
    /**
     * Collect list of all wikis obtained
     * through Special:SiteMatrix
     */
    getWikis: () => {
        if ( typeof(window.wikis) === "undefined" ){
        
            let apiURI = 'https://meta.wikimedia.org/w/api.php?action=sitematrix&smlangprop=site&smsiteprop=url&format=json&origin=*'

            return fetch(apiURI)
            .then(response => response.json())
            .then(data => {
                
                // flatten arrays
                let specials = data.sitematrix.specials
                specials = specials.map(a => a.url.replace('https://',''))
                
                // remove key 'count' and 'specials'
                delete data.sitematrix.count
                delete data.sitematrix.specials
                
                data = Object.values(data.sitematrix)
                
                data = data.reduce((a, b) => a.concat(b.site), []);
                data = data.map((wiki) => wiki.url.replace('https://',''))
                window.wikis = data.concat(specials)
                return window.wikis
            })

        }else {
            return Promise.resolve(window.wikis)
        }
    }

}