/**
 * Global variables
 * 
 */
let resultChart;
/**
 * Chain previous methods together
 * and collect the data we need
 */
const collectAllData = () => {
    let list = {
      usernames: [],
      homewikis: []
    }
    History.getUsers()
        .then(users => {
            // display stats chart with empty data
            Stats.displayChart([])
            users.forEach(item => {
                History.getUserDetails(item)
                    .then(user => {
                        if(list.usernames.indexOf(user.username) < 0) {
                            updateUI(user)
                            list.usernames.push(user.username)
                            list.homewikis.push(user.home)

                            // TODO: use updateChart for better performance
                            Stats.displayChart(list.homewikis)
                        }                    
                    }).catch(error => console.log(`error: ${error}`))
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

/**
 * Start and stop animation
 */
const init = () => {
    let stop = document.querySelectorAll("#stop")[0]
    let running = false

    // Run the show
    let start = document.querySelectorAll("#start")[0]
    start.addEventListener("click", (e)=> {
        running = true;
        //stop.style.display = "inline-block"
        collectAllData();
    })

    // autocomplete for wikis
    let wiki = document.querySelector('input[name=wiki]')
    let page = document.querySelector('input[name=page]')

    AutoComplete.wikis().then(wikis => {
        $( 'input[name=wiki]' ).autocomplete({
            source: wikis
        });
    })
    
        
}

init();