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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var WikiRepository = {
    getWikis: function () {
        if (typeof window.wikis === "undefined") {
            var apiURI = "https://meta.wikimedia.org/w/api.php?action=sitematrix&smlangprop=site&smsiteprop=url&format=json&origin=*";
            return fetch(apiURI)
                .then(function (response) { return response.json(); })
                .then(function (data) {
                var specials = data.sitematrix.specials;
                specials = specials.map(function (a) { return a.url.replace("https://", ""); });
                delete data.sitematrix.count;
                delete data.sitematrix.specials;
                data = Object.values(data.sitematrix);
                data = data.reduce(function (a, b) { return a.concat(b.site); }, []);
                data = data.map(function (wiki) { return wiki.url.replace("https://", ""); });
                window.wikis = data.concat(specials);
                return window.wikis;
            })
                .catch(function (e) { });
        }
        else {
            return Promise.resolve(window.wikis);
        }
    },
    getUsers: function (limit, data) {
        if (limit === void 0) { limit = 500; }
        return __awaiter(_this, void 0, void 0, function () {
            var query_url, users, wiki, page, userNumberLimit, res, results, title_1, userDetailsBatch, results_1, results_1_1, user, batchSize, i, batch, e_1;
            var e_2, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query_url = "";
                        wiki = document.querySelector("input[name=wiki]").value;
                        page = document.querySelector("input[name=page]").value;
                        userNumberLimit = 2500;
                        page = encodeURIComponent(page);
                        if (!(wiki !== "" && page !== "")) return [3, 13];
                        if (typeof data !== "undefined" &&
                            typeof data.continue.rvcontinue !== "undefined") {
                            query_url = "https://".concat(wiki, "/w/api.php?action=query&prop=revisions");
                            query_url += "&titles=".concat(page, "&formatversion=2&redirects=1&format=json");
                            query_url += "&rvlimit=".concat(limit, "&origin=*");
                            query_url += "&rvcontinue=".concat(data.continue.rvcontinue);
                        }
                        else {
                            query_url = "https://".concat(wiki, "/w/api.php?action=query&prop=revisions");
                            query_url += "&titles=".concat(page, "&formatversion=2&redirects=1&format=json");
                            query_url += "&rvlimit=".concat(limit, "&origin=*");
                            Stats.displayChart([]);
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 12, , 13]);
                        return [4, fetch(query_url)];
                    case 2:
                        res = _b.sent();
                        return [4, res.json()];
                    case 3:
                        data = _b.sent();
                        results = data.query.pages[0].revisions;
                        title_1 = data.query.pages[0].title;
                        if (typeof users === "undefined" || usernames === "undefined") {
                            users = [];
                            usernames = [];
                        }
                        userDetailsBatch = [];
                        try {
                            for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                                user = results_1_1.value;
                                user = {
                                    timestamp: user["timestamp"],
                                    username: user["user"],
                                    revid: user["revid"],
                                    page: title_1,
                                };
                                if (!usernames.includes(user.username)) {
                                    usernames.push(user.username);
                                    userDetailsBatch.push(user.username);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (!(userDetailsBatch.length > 0)) return [3, 9];
                        batchSize = 100;
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < userDetailsBatch.length)) return [3, 7];
                        batch = userDetailsBatch.slice(i, i + batchSize);
                        return [4, Promise.all(batch.map(function (username) { return __awaiter(_this, void 0, void 0, function () {
                                var user, _a, _b, e_3;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _c.trys.push([0, 4, , 5]);
                                            return [4, WikiRepository.getUserDetails({
                                                    username: username,
                                                    page: title_1,
                                                })];
                                        case 1:
                                            user = _c.sent();
                                            if (!user) return [3, 3];
                                            _a = user;
                                            _b = "recentedits";
                                            return [4, WikiRepository.getRecentEdits(user.username, user.homeurl)];
                                        case 2:
                                            _a[_b] = _c.sent();
                                            updateUI(user);
                                            list.usernames.push(user.username);
                                            list.homewikis.push(user.home);
                                            Stats.displayChart(list.homewikis);
                                            updateSummary();
                                            _c.label = 3;
                                        case 3: return [3, 5];
                                        case 4:
                                            e_3 = _c.sent();
                                            console.error("Error fetching user details:", e_3);
                                            return [3, 5];
                                        case 5: return [2];
                                    }
                                });
                            }); }))];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        i += batchSize;
                        return [3, 4];
                    case 7: return [4, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        if (!(!data.hasOwnProperty("batchcomplete") &&
                            list.usernames.length <= userNumberLimit)) return [3, 11];
                        return [4, WikiRepository.getUsers(limit, data)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [2, list.usernames];
                    case 12:
                        e_1 = _b.sent();
                        console.error(e_1);
                        return [3, 13];
                    case 13: return [2, []];
                }
            });
        });
    },
    getUserDetails: function (user) { return __awaiter(_this, void 0, void 0, function () {
        var relevantGroups, relevantGlobalGroups, wiki, username, query_url;
        return __generator(this, function (_a) {
            relevantGroups = [
                "rollbacker",
                "sysop",
                "checkuser",
                "oversighter",
                "otrs members",
                "stewards",
                "staff",
            ];
            relevantGlobalGroups = [
                "global-interface-editor",
                "global-rollbacker",
                "global-sysop",
                "ombuds",
                "otrs-member",
            ];
            wiki = document.querySelector("input[name=wiki]").value;
            username = encodeURIComponent(user.username);
            query_url = "https://" +
                wiki +
                "/w/api.php?action=query&meta=globaluserinfo&format=json&guiuser=";
            query_url += username + "&origin=*";
            query_url += "&guiprop=groups|editcount|merged";
            return [2, fetch(query_url)
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                    if (data.hasOwnProperty("error")) {
                        return null;
                    }
                    if (data.query.hasOwnProperty("globaluserinfo")) {
                        user["registration"] = data.query.globaluserinfo.registration;
                        user["rights"] = data.query.globaluserinfo.merged;
                        user["home"] = user["rights"].reduce(function (acc, cur) { return (acc.editcount < cur.editcount ? cur : acc); }, { editcount: 0 }).wiki;
                        user["globalGroups"] = data.query.globaluserinfo.groups;
                        user["editcount"] = data.query.globaluserinfo.editcount;
                        user["homeurl"] = user["rights"].filter(function (item) { return item.wiki === user["home"]; })[0]["url"];
                        user["rights"] = user["rights"].filter(function (item) {
                            return new URL(item.url).host === wiki &&
                                "groups" in item &&
                                item.groups.some(function (r) { return relevantGroups.includes(r.toLowerCase()); });
                        });
                        user["globalGroups"] = user["globalGroups"].filter(function (item) {
                            return relevantGlobalGroups.includes(item);
                        });
                        user["rights"] = user["rights"].sort(function (b, a) { return a.editcount >= b.editcount; });
                        user["rights"] = user["rights"].map(function (item) {
                            item["groups"] = item["groups"].filter(function (i) { return relevantGroups.indexOf(i) >= 0; });
                            return item["groups"];
                        });
                        if (Array.isArray(user.rights[0]))
                            user["rights"] = user["rights"][0];
                        user["rights"] = __spreadArray(__spreadArray([], __read(user["rights"]), false), __read(user["globalGroups"]), false).join(", ");
                        return user;
                    }
                })
                    .catch(function (e) {
                    return null;
                })];
        });
    }); },
    getPages: function (pageInputContainer, wikiInputContainer) { return __awaiter(_this, void 0, void 0, function () {
        var pageInput, wikiInput, query_url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pageInput = document.querySelector(pageInputContainer);
                    wikiInput = document.querySelector(wikiInputContainer);
                    if (typeof wikiInput === "indefined" || wikiInput.value === "") {
                        console.log("empty value");
                        return [2, Promise.resolve([])];
                    }
                    query_url = "https://" + wikiInput.value + "/w/api.php?action=query&list=search";
                    query_url += "&srsearch=" + pageInput.value + "&srnamespace=*";
                    query_url += "&format=json&origin=*";
                    return [4, fetch(query_url)
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            var result = data.query.search.reduce(function (a, b) { return a.concat(b.title); }, []);
                            return result;
                        })
                            .catch(function (error) {
                            return [];
                        })];
                case 1:
                    source = _a.sent();
                    return [2, source];
            }
        });
    }); },
    getRecentBlocks: function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2];
        });
    }); },
    getRecentEdits: function (username, homewikiURI) { return __awaiter(_this, void 0, void 0, function () {
        var lastMonth, apiURI;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastMonth = new Date();
                    lastMonth.setDate(lastMonth.getDate() - 15);
                    lastMonth = lastMonth.toISOString();
                    apiURI = homewikiURI + "/w/api.php?action=query&list=usercontribs";
                    apiURI +=
                        "&uclimit=50&ucend=" +
                            lastMonth +
                            "&ucuser=" +
                            username +
                            "&format=json&origin=*";
                    return [4, fetch(apiURI)
                            .then(function (data) { return data.json(); })
                            .then(function (recentEdits) { return recentEdits.query.usercontribs; })
                            .catch()];
                case 1:
                    res = _a.sent();
                    return [2, res];
            }
        });
    }); },
};
