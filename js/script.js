/**
 * Global variables
 * 
 */
let resultChart;

/**
 * Collect the data we need asynchronously
 */
const collectAllData = async () => {
    let list = {
        usernames: [],
        homewikis: []
    }
    // Variables
    let wiki = document.querySelector('input[name=wiki]').value
    let page = document.querySelector('input[name=page]').value

    if (wiki !== "" && page !== "") {
        document.querySelector('.canvas-wrapper').style.display = 'block'
        document.querySelector('#preloader').style.display = 'block'
        let users = await WikiRepository.getUsers()
        // console.log('users', users)

        users.forEach(async (item) => {
            let user = await WikiRepository.getUserDetails(item)

            if (typeof user !== 'undefined' && user !== null) {
                // Add recent edits
                user['recentedits'] = await WikiRepository.getRecentEdits(user.username, user.homeurl)
                // if (list.usernames.indexOf(user.username) < 0) {
                updateUI(user)
                list.usernames.push(user.username)
                list.homewikis.push(user.home)
                Stats.displayChart(list.homewikis)
                //}
            }
        });

        // display stats chart with empty data
        Stats.displayChart([])


    } else {
        alert('Empty fields')
    }
}

/**
 * Remove all rows from table
 */
const clearAllData = () => {
    let table = document.getElementById("results-table").querySelector("tbody")
    table.innerHTML = ""
    let counter = document.querySelectorAll("#data h2 span#total")[0]
    counter.innerText = "0"

}

/**
 * Update the user interface by adding new users
 * to the table with their relevant details
 * 
 * @param {Object} user 
 */
const updateUI = (user) => {
    document.querySelector('#preloader').style.display = 'none'

    if (typeof user !== 'undefined' && typeof user.username !== 'undefined') {
        addRowToTable(user)
        let counter = document.querySelectorAll("#data h2 span#total")[0]
        counter.innerText = parseInt(counter.innerText) + 1
    }
}

/**
 * Append row to the table
 * 
 * @param {Object} item
 */
const addRowToTable = (item) => {
    // build HTML rows
    let table = document.getElementById("results-table").querySelector("tbody")
    let count = table.childNodes.length + 1
    let row = document.createElement("tr")
    //let duration = getDuration(new Date(item.registration), new Date())
    let duration = new Date(item.registration).getFullYear()
    let rowHTML = ""
    // rowHTML += "<td>" + (count++) + "</td>"
    rowHTML += `<td><a href="${item.homeurl}/wiki/User:${item.username}">${item.username}</a></td>`
    rowHTML += "<td>" + item.home + "</td>"
    rowHTML += "<td>" + duration + "</td>"
    rowHTML += "<td>" + (item.rights.length > 0 ? item.rights : "") + "</td>"
    rowHTML += "<td>" + (item.recentedits.length < 50 ? item.recentedits.length : "+50") + "</td>"
    row.innerHTML = rowHTML
    table.append(row)
}

/**
 * Start and stop animation
 */
const init = () => {

    // Extract URL parameters
    window.addEventListener('load', (e) => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('wiki') && urlParams.has('page')) {

            // Variables
            let wiki = document.querySelector('input[name=wiki]')
            let page = document.querySelector('input[name=page]')

            wiki.value = urlParams.get('wiki')
            page.value = urlParams.get('page')

            // Trigger search
            clearAllData();
            collectAllData();
        }

    })
    let stop = document.querySelectorAll("#stop")[0]
    let running = false

    // Run the show
    let start = document.querySelectorAll("#start")[0]
    start.addEventListener("click", (e) => {
        running = true;
        e.preventDefault()
        document.querySelector('#data form').submit()
        // stop.style.display = "inline-block"
    })

    wikiAutoComplete();
    pageAutoComplete();

}

/**
 * Attach auto-complete to "wiki" input field
 */
const wikiAutoComplete = () => {
    let inputContainer = "input[name=wiki]";
    let resultContainerID = "wiki_results";
    let data = WikiRepository.getWikis();
    attachAutoComplete(inputContainer, resultContainerID, data);
}

/**
 * Attach auto-complete to "page" input field
 */
const pageAutoComplete = () => {
    let pageInputContainer = "input[name=page]";
    let wikiInputContainer = "input[name=wiki]";
    let resultContainerID = "page_results";
    let data = async () => WikiRepository.getPages(pageInputContainer, wikiInputContainer)
    attachAutoComplete(pageInputContainer, resultContainerID, data);
}

/**
 * Helper method for attaching the autocomplete
 * interactions to an input
 */
const attachAutoComplete = (inputContainer, resultContainerID, data) => {
    new autoComplete({
        data: { // Data src [Array, Function, Async] | (REQUIRED)
            src: data,
            cache: false
        },
        selector: inputContainer, // Input field selector              | (Optional)
        debounce: 250, // Post duration for engine to start | (Optional)
        resultsList: { // Rendered results list object      | (Optional)
            render: true,
            /* if set to false, add an eventListener to the selector for event type
               "autoComplete" to handle the result */
            container: source => {
                source.setAttribute("id", resultContainerID);
            },
            destination: document.querySelector(inputContainer),
            position: "afterend",
            element: "ul"
        },
        maxResults: 5,
        highlight: true,
        noResults: () => { // Action script on noResults      | (Optional)
            const result = document.createElement("li");
            result.setAttribute("class", "no_result autoComplete_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "No Results";
            document.querySelector(inputContainer).parentElement.querySelector(`#${resultContainerID}`).appendChild(result);
        },
        onSelection: item => { // Action script onSelection event | (Optional)
            document.querySelector(inputContainer).value = item.selection.value;
        }
    });
}

/**
 * Indicate elapsted time between two dates
 * @param {Date} aDate  oldest date 
 * @param {Date} bDate  most recent date 
 * 
 * @return an object containing details on elapsed time
 */
const getDuration = (aDate, bDate) => {

    let delta = bDate.getTime() - aDate.getTime()
    delta = delta / 1000
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var totalminutes = 0;
    if (days > 0) {
        totalminutes += 24 * 60 * days
    }

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    if (hours > 0) {
        totalminutes += 60 * hours
    }

    // calculate (and subtract) whole minutes
    var minutes = Math.ceil(delta / 60) % 60;
    delta -= minutes * 60;

    if (minutes > 0) {
        totalminutes += minutes
    }

    // what's left is seconds
    var seconds = delta % 60; // in theory the modulus is not required

    // total hours, for 48-hour KPI purpose
    var totalhours = (days * 24) + (hours) + (minutes / 60);

    return {
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds,
        'totalhours': totalhours,
        'totalminutes': totalminutes
    }

}
init();