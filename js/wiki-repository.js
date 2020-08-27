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
    },
    /**
     * Extract users details
     * from JSON
     */
    getUsers : () => {

        // Variables
        let wiki = document.querySelector('input[name=wiki]').value
        let page = document.querySelector('input[name=page]').value
        //let limit = document.getElementById('limit').value()
        //let from = new Date(document.getElementById('from').value())
        //let until = new Date(document.getElementById('until').value())
        let limit = 500
        
        


        page = encodeURIComponent(page)
        let query_url = "https://" + wiki + "/w/api.php?action=query&prop=revisions"
        query_url += "&titles=" + page + "&formatversion=2&redirects=1"
        /*
        if (limit === "") {
            limit = 500
        }
        if (from.length !== "" && until.length !== "") {
            query_url += `&revstart=${from.getTime()}`
            query_url += `&revend=${until.getTime()}`
        }
        */

        query_url += "&format=json&rvlimit=" + limit + "&origin=*"

        if (wiki !== "" && page !== "") {
        return fetch(query_url)
            .then(res => res.json())
            .then(data => {
                let users = []
                let results = data.query.pages[0].revisions
                let page = data.query.pages[0].title

                for (let user of results) {
                    // keep only sock masters
                    users.push({
                        timestamp: user['timestamp'],
                        username: user['user'],
                        revid: user['revid'],
                        page: page
                    })
                }

                return users

            })
        }else{
            alert('Empty fields')
        }

    },
    /**
     * Get details including home project
     * for specific user
     */
    getUserDetails: (user) => {
        let wiki = document.querySelector('input[name=wiki]').value
        let username = encodeURIComponent(user.username)
        let query_url = "https://" + wiki + "/w/api.php?action=query&meta=globaluserinfo&format=json&guiuser="
        query_url += username + "&origin=*"
        return fetch(query_url)
            .then(res => res.json())
            .then(data => {
                //console.log(JSON.stringify(data))
                user['registration'] = data.query.globaluserinfo.registration
                user['home'] = data.query.globaluserinfo.home
                return user

            }).catch(error => console.log(`error: ${error}`))
    },
    /**
     * Collect list of all wikis obtained
     * through Special:SiteMatrix
     */
    getPages: async (pageInputContainer, wikiInputContainer) => {
        
        let pageInput = document.querySelector(pageInputContainer)
		let wikiInput = document.querySelector(wikiInputContainer)
		if(typeof wikiInput === 'indefined' || wikiInput.value === ''){
            console.log('empty value') // TODO: Notify user that value is empty
			return Promise.resolve([]) // empty array
		}
		
		let query_url = "https://" + wikiInput.value + "/w/api.php?action=query&list=search"
		query_url += "&srsearch=" + pageInput.value + "&srnamespace=*"
        query_url += "&format=json&origin=*"
        
        source = await fetch(query_url)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                let result = data.query.search.reduce((a, b) => a.concat(b.title), []);
                return result;
            }).catch(error => { 
                console.log(`error: ${error}`)
                return []
            })
            
        return source
	},
}