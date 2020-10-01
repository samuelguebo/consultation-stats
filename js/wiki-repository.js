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
     * Obtain list of all edits from a page and 
     * isolate all single accounts who edited it.
     * Bypass the 500 limit using recursivity
     */
    getUsers: async (limit = 500, data) => {
        // Variables
        let query_url = '';
        let users;
        let wiki = document.querySelector('input[name=wiki]').value
        let page = document.querySelector('input[name=page]').value

        page = encodeURIComponent(page);
        // console.log(data)
        if (wiki !== '' && page !== '') {
            if (
                typeof data !== 'undefined' &&
                typeof data.continue.rvcontinue !== 'undefined'
            ) {
                query_url = `https://${wiki}/w/api.php?action=query&prop=revisions&titles=${page}&formatversion=2&redirects=1&format=json&rvlimit=${limit}&origin=*`;
                query_url += `&rvcontinue=${data.continue.rvcontinue}`;
                users = data.users
                usernames = data.usernames
            } else {
                query_url =
                    'https://' + wiki + '/w/api.php?action=query&prop=revisions';
                query_url += '&titles=' + page + '&formatversion=2&redirects=1';
                query_url += '&format=json&rvlimit=' + limit + '&origin=*';
            }

            let res = await fetch(query_url);
            data = await res.json();

            let results = data.query.pages[0].revisions;
            let title = data.query.pages[0].title;

            if (typeof users === 'undefined' || usernames === 'undefined') {
                users = []
                usernames = []
            }

            for (let user of results) {
                let item = {
                    timestamp: user['timestamp'],
                    username: user['user'],
                    revid: user['revid'],
                    page: title,
                }

                // build list of users, avoid dulication
                if (usernames.indexOf(item.username) < 0) {
                    users.push(item);
                    usernames.push(item.username);
                }

            }

            data['users'] = users
            data['usernames'] = usernames
            // console.log(users.length);

            // continue to process batch otherwise return users
            if (!data.hasOwnProperty('batchcomplete')) {
                await WikiRepository.getUsers(limit, data);
            }
            return users;

        } else {
            return [];
        }
    },
    /**
     * Get details including home project
     * for specific user
     * 
     * @param {Object} user 
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