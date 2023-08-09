var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var _this = this;
var resultChart;
var list = {
    usernames: [],
    homewikis: [],
};
var collectAllData = function () { return __awaiter(_this, void 0, void 0, function () {
    var wiki, page;
    return __generator(this, function (_a) {
        wiki = document.querySelector("input[name=wiki]").value;
        page = document.querySelector("input[name=page]").value;
        if (wiki !== "" && page !== "") {
            document.querySelector(".canvas-wrapper").style.display = "block";
            document.querySelector("#preloader").style.display = "block";
            WikiRepository.getUsers();
        }
        else {
            alert("Empty fields");
        }
        return [2];
    });
}); };
var clearAllData = function () {
    var table = document.getElementById("summary-table").querySelector("tbody");
    table.innerHTML = "";
    var counter = document.querySelectorAll("#data h2 span#total")[0];
    counter.innerText = "0";
};
var updateSummary = function () {
    var table = document.getElementById("summary-table").querySelector("tbody");
    table.innerHTML = "";
    var totalUsers = list.usernames.length;
    var uniqueWikis = Array.from(new Set(list.homewikis)).map(function (item) { return ({
        label: item,
    }); });
    uniqueWikis = uniqueWikis.map(function (_a) {
        var e_1, _b;
        var label = _a.label;
        var count = 0;
        try {
            for (var _c = __values(list.homewikis), _d = _c.next(); !_d.done; _d = _c.next()) {
                var homewiki = _d.value;
                if (homewiki == label)
                    count++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { label: label, count: count };
    });
    uniqueWikis.sort(function (A, B) { return B.count - A.count; });
    uniqueWikis.forEach(function (_a) {
        var label = _a.label, count = _a.count;
        var row = document.createElement("tr");
        var percent = ((count * 100) / totalUsers).toFixed(2);
        row.innerHTML = "<td>".concat(label, "</td><td class=\"percent\">").concat(percent, "</td>");
        table.append(row);
    });
};
var updateUI = function (user) {
    document.querySelector("#preloader").style.display = "none";
    if (typeof user !== "undefined" && typeof user.username !== "undefined") {
        addRowToTable(user);
        var counter = document.querySelectorAll("#data h2 span#total")[0];
        counter.innerText = parseInt(counter.innerText) + 1;
    }
};
var addRowToTable = function (item) {
    var table = document.getElementById("results-table").querySelector("tbody");
    var count = table.childNodes.length + 1;
    var row = document.createElement("tr");
    var duration = new Date(item.registration).getFullYear();
    var rowHTML = "";
    rowHTML += "<td><a href=\"".concat(item.homeurl, "/wiki/User:").concat(item.username, "\">").concat(item.username, "</a></td>");
    rowHTML += "<td>" + item.home + "</td>";
    rowHTML += "<td>" + duration + "</td>";
    rowHTML += "<td>" + (item.rights.length > 0 ? item.rights : "") + "</td>";
    rowHTML +=
        "<td>" +
            (item.recentedits.length < 50 ? item.recentedits.length : "+50") +
            "</td>";
    row.innerHTML = rowHTML;
    table.append(row);
};
var init = function () {
    window.addEventListener("load", function (e) {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("wiki") && urlParams.has("page")) {
            var wiki = document.querySelector("input[name=wiki]");
            var page = document.querySelector("input[name=page]");
            wiki.value = urlParams.get("wiki");
            page.value = urlParams.get("page");
            clearAllData();
            collectAllData();
        }
    });
    var stop = document.querySelectorAll("#stop")[0];
    var running = false;
    var start = document.querySelectorAll("#start")[0];
    start.addEventListener("click", function (e) {
        running = true;
        e.preventDefault();
        document.querySelector("#data form").submit();
    });
    wikiAutoComplete();
    pageAutoComplete();
};
var wikiAutoComplete = function () {
    var inputContainer = "input[name=wiki]";
    var resultContainerID = "wiki_results";
    var data = WikiRepository.getWikis();
    attachAutoComplete(inputContainer, resultContainerID, data);
};
var pageAutoComplete = function () {
    var pageInputContainer = "input[name=page]";
    var wikiInputContainer = "input[name=wiki]";
    var resultContainerID = "page_results";
    var data = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, WikiRepository.getPages(pageInputContainer, wikiInputContainer)];
    }); }); };
    attachAutoComplete(pageInputContainer, resultContainerID, data);
};
var attachAutoComplete = function (inputContainer, resultContainerID, data) {
    new autoComplete({
        data: {
            src: data,
            cache: false,
        },
        selector: inputContainer,
        debounce: 250,
        resultsList: {
            render: true,
            container: function (source) {
                source.setAttribute("id", resultContainerID);
            },
            destination: document.querySelector(inputContainer),
            position: "afterend",
            element: "ul",
        },
        maxResults: 5,
        highlight: true,
        noResults: function () {
            var result = document.createElement("li");
            result.setAttribute("class", "no_result autoComplete_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "No Results";
            document
                .querySelector(inputContainer)
                .parentElement.querySelector("#".concat(resultContainerID))
                .appendChild(result);
        },
        onSelection: function (item) {
            document.querySelector(inputContainer).value = item.selection.value;
        },
    });
};
var getDuration = function (aDate, bDate) {
    var delta = bDate.getTime() - aDate.getTime();
    delta = delta / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var totalminutes = 0;
    if (days > 0) {
        totalminutes += 24 * 60 * days;
    }
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    if (hours > 0) {
        totalminutes += 60 * hours;
    }
    var minutes = Math.ceil(delta / 60) % 60;
    delta -= minutes * 60;
    if (minutes > 0) {
        totalminutes += minutes;
    }
    var seconds = delta % 60;
    var totalhours = days * 24 + hours + minutes / 60;
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        totalhours: totalhours,
        totalminutes: totalminutes,
    };
};
init();
