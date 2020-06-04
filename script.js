/**
 * Chain previous methods together
 * and collect the data we need
 */
const collectAllData = () => {
    let usernames = []
    History.getUsers()
        .then(users => {
            users.forEach(item => {
                History.getUserDetails(item)
                    .then(user => {
                        if(usernames.indexOf(user.username) < 1) {
                            updateUI(user)
                            usernames.push(user.username)
                        }
                    })

            });

        })
}

/**
 * Update the number and provide a download button
 */
const updateUI = (user) => {
    if (typeof (user) !== 'indefined') {
        addRowToTable(user)
        let counter = document.querySelectorAll("#data h2 span#total")[0]
        counter.innerText = parseInt(counter.innerText) + 1
    }
}

/**
 * Append row to the table
 */
const addRowToTable = (item) => {
    // build HTML rows
    let table = document.getElementById("results-table").querySelector("tbody")
    let count = table.childNodes.length
    let row = document.createElement("tr")
    let rowHTML = "<td>" + (count++) + "</td>"
    rowHTML += "<td>" + item.username + "</td>"
    rowHTML += "<td>" + item.home + "</td>"
    row.innerHTML = rowHTML
    table.append(row)
}