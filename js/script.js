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
    // Variables
    let wiki = document.querySelector('input[name=wiki]').value
    let page = document.querySelector('input[name=page]').value

    if (wiki !== "" && page !== "") {
        WikiRepository.getUsers()
            .then(users => {
                // display stats chart with empty data
                Stats.displayChart([])
                users.forEach(item => {
                    WikiRepository.getUserDetails(item)
                        .then(user => {
                            if (list.usernames.indexOf(user.username) < 0) {
                                updateUI(user)
                                list.usernames.push(user.username)
                                list.homewikis.push(user.home)

                                // TODO: use updateChart for better performance
                                Stats.displayChart(list.homewikis)
                            }
                        }).catch(error => console.log(`error: ${error}`))
                });

            })
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
    let count = table.childNodes.length + 1
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
    start.addEventListener("click", (e) => {
        running = true;
        //stop.style.display = "inline-block"
        clearAllData();
        collectAllData();
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

init();