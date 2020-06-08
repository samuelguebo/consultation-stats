const History = {
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
    }
}