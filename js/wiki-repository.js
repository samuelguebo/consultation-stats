const WikiRepository = {

    /**
     * Collect list of all wikis obtained
     * through Special:SiteMatrix
     */
    getWikis: () => {
        if (typeof (window.wikis) === "undefined") {

            let apiURI = 'https://meta.wikimedia.org/w/api.php?action=sitematrix&smlangprop=site&smsiteprop=url&format=json&origin=*'

            return fetch(apiURI)
                .then(response => response.json())
                .then(data => {

                    // flatten arrays
                    let specials = data.sitematrix.specials
                    specials = specials.map(a => a.url.replace('https://', ''))

                    // remove key 'count' and 'specials'
                    delete data.sitematrix.count
                    delete data.sitematrix.specials

                    data = Object.values(data.sitematrix)

                    data = data.reduce((a, b) => a.concat(b.site), []);
                    data = data.map((wiki) => wiki.url.replace('https://', ''))
                    window.wikis = data.concat(specials)
                    return window.wikis
                })

        } else {
            return Promise.resolve(window.wikis)
        }
    },

    /**
     * Extract users details
     * from JSON
     */
    getUsers: async () => {

        // Variables
        let wiki = document.querySelector('input[name=wiki]').value
        let page = document.querySelector('input[name=page]').value
        // let limit = document.getElementById('limit').value()
        // let from = new Date(document.getElementById('from').value())
        // let until = new Date(document.getElementById('until').value())
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
            let res = fetch(query_url)
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
            return res
        } else {
            return []
        }

    },
    /**
     * Get details including home project
     * for specific user
     */
    getUserDetails: async (user) => {
        let relevantGroups = ['rollbacker', 'sysop', 'checkuser', 'oversighter', 'otrs members', 'stewards', 'staff'];
        let wiki = document.querySelector('input[name=wiki]').value
        let username = encodeURIComponent(user.username)
        let query_url = "https://" + wiki + "/w/api.php?action=query&meta=globaluserinfo&format=json&guiuser="
        query_url += username + "&origin=*"
        query_url += '&guiprop=groups|editcount|merged'
        let res = null
        try {

            res = await fetch(query_url)
                .then(res => res.json())
                .then(data => {
                    if (data.query.hasOwnProperty('globaluserinfo')) {

                        //console.log(JSON.stringify(data))
                        // console.log(username)
                        user['registration'] = data.query.globaluserinfo.registration
                        user['home'] = data.query.globaluserinfo.home
                        user['rights'] = data.query.globaluserinfo.merged;
                        user['editcount'] = data.query.globaluserinfo.editcount;

                        // Extract homewiki url
                        user['homeurl'] = user['rights'].filter(
                            item => item.wiki === user['home']
                        )[0]['url'];

                        // Pick only homewiki rights that are in relevant user groups
                        user['rights'] = user['rights'].filter(
                            item => 'groups' in item &&
                            item.groups.some(r => relevantGroups.includes(r.toLowerCase())) &&
                            item.wiki === user['home']
                        );

                        // Make sure users have a group and relevant groups
                        user['rights'] = user['rights'].filter(items => 'groups' in items && items.groups.some(r => relevantGroups.includes(r.toLowerCase())));

                        // sort by edit count
                        user['rights'] = user['rights'].sort((b, a) => a.editcount >= b.editcount);

                        // Flatten results into comma separated list
                        user['rights'] = user['rights'].map(item => {
                            item['groups'] = item['groups'].filter(i => relevantGroups.indexOf(i) > 0)
                            return item['groups'].join(', ')
                        })

                        return user
                    }
                })
        } catch (e) {
            // console.log(e)
        }

        return res
        //.catch(error => console.log(`error: ${error}`))
    },
    /**
     * Search and get pages that match certain 
     * keywords
     */
    getPages: async (pageInputContainer, wikiInputContainer) => {

        let pageInput = document.querySelector(pageInputContainer)
        let wikiInput = document.querySelector(wikiInputContainer)
        if (typeof wikiInput === 'indefined' || wikiInput.value === '') {
            console.log('empty value')
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
                // console.log(`error: ${error}`)
                return []
            })

        return source
    },

    /**
     * Indicate whether user account was blocked
     * over a certain recent period
     */
    getRecentBlocks: async () => {
        // TODO: Implement the feature if needed
        // https://fr.wikipedia.org/w/api.php?action=query&list=blocks&bkusers=<USERNAME>&format=json


    },

    /**
     * List edits performed by a user
     * over a certain recent period
     */
    getRecentEdits: async (username, homewikiURI) => {
        let lastMonth = new Date()
        lastMonth.setDate(lastMonth.getDate() - 15)
        lastMonth = lastMonth.toISOString()

        let apiURI = homewikiURI + '/w/api.php?action=query&list=usercontribs'
        apiURI += '&uclimit=50&ucend=' + lastMonth + '&ucuser=' + username + '&format=json&origin=*'

        res = await fetch(apiURI)
            .then(data => data.json())
            .then(recentEdits => recentEdits.query.usercontribs)
            .catch()

        return res
    }
}