const WikiRepository = {
  /**
   * Collect list of all wikis obtained
   * through Special:SiteMatrix
   */
  getWikis: () => {
    if (typeof window.wikis === "undefined") {
      let apiURI =
        "https://meta.wikimedia.org/w/api.php?action=sitematrix&smlangprop=site&smsiteprop=url&format=json&origin=*";

      return fetch(apiURI)
        .then((response) => response.json())
        .then((data) => {
          // flatten arrays
          let specials = data.sitematrix.specials;
          specials = specials.map((a) => a.url.replace("https://", ""));

          // remove key 'count' and 'specials'
          delete data.sitematrix.count;
          delete data.sitematrix.specials;

          data = Object.values(data.sitematrix);

          data = data.reduce((a, b) => a.concat(b.site), []);
          data = data.map((wiki) => wiki.url.replace("https://", ""));
          window.wikis = data.concat(specials);
          return window.wikis;
        })
        .catch((e) => {});
    } else {
      return Promise.resolve(window.wikis);
    }
  },

  /**
   * Obtain list of all edits from a page and
   * isolate all single accounts who edited it.
   * Bypass the 500 limit using recursivity
   */
  getUsers: async (limit = 500, data) => {
    let query_url = "";
    let users;
    let wiki = document.querySelector("input[name=wiki]").value;
    let page = document.querySelector("input[name=page]").value;
    const userNumberLimit = 1000; // Arbitrary limit for saving resources

    page = encodeURIComponent(page);
    if (wiki !== "" && page !== "") {
      if (
        typeof data !== "undefined" &&
        typeof data.continue.rvcontinue !== "undefined"
      ) {
        // If a "rvcontinue" parameters exits, build URI differently
        query_url = `https://${wiki}/w/api.php?action=query&prop=revisions`;
        query_url += `&titles=${page}&formatversion=2&redirects=1&format=json`;
        query_url += `&rvlimit=${limit}&origin=*`;
        query_url += `&rvcontinue=${data.continue.rvcontinue}`;
      } else {
        query_url = `https://${wiki}/w/api.php?action=query&prop=revisions`;
        query_url += `&titles=${page}&formatversion=2&redirects=1&format=json`;
        query_url += `&rvlimit=${limit}&origin=*`;

        // display stats chart with empty data the first time
        Stats.displayChart([]);
      }

      // Get edits and extract users
      try {
        let res = await fetch(query_url);
        data = await res.json();

        let results = data.query.pages[0].revisions;
        let title = data.query.pages[0].title;

        if (typeof users === "undefined" || usernames === "undefined") {
          users = [];
          usernames = [];
        }

        // Loop through users and populate UI
        for (let user of results) {
          user = {
            timestamp: user["timestamp"],
            username: user["user"],
            revid: user["revid"],
            page: title,
          };

          // Avoid dupicates by keeping track of table list
          if (usernames.indexOf(user.username) < 0) {
            usernames.push(user.username);

            // Collect additional details about contributor
            WikiRepository.getUserDetails(user)
              .then(async (user) => {
                if (typeof user !== "undefined" && user !== null) {
                  // Add recent edits
                  user["recentedits"] = await WikiRepository.getRecentEdits(
                    user.username,
                    user.homeurl
                  );

                  // Discard duplicates
                  if (list.usernames.indexOf(user.username) < 0) {
                    updateUI(user);
                    list.usernames.push(user.username);
                    list.homewikis.push(user.home);

                    // Refresh chart
                    Stats.displayChart(list.homewikis);
                    updateSummary();
                  }
                }
              })
              .catch((e) => {});
          }
        }

        // limit number of results to process, for saving resources
        if (
          !data.hasOwnProperty("batchcomplete") &&
          list.usernames.length <= userNumberLimit
        ) {
          // continue to process batch otherwise return users
          await WikiRepository.getUsers(limit, data);
        }

        return list.usernames;
      } catch (e) {
        // fails silently
      }
    }

    return [];
  },
  /**
   * Get details including home project
   * for specific user
   *
   * @param {Object} user
   */
  getUserDetails: async (user) => {
    const relevantGroups = [
      "rollbacker",
      "sysop",
      "checkuser",
      "oversighter",
      "otrs members",
      "stewards",
      "staff",
    ];
    const relevantGlobalGroups = [
      "global-interface-editor",
      "global-rollbacker",
      "global-sysop",
      "ombuds",
      "otrs-member",
    ];
    let wiki = document.querySelector("input[name=wiki]").value;
    let username = encodeURIComponent(user.username);
    let query_url =
      "https://" +
      wiki +
      "/w/api.php?action=query&meta=globaluserinfo&format=json&guiuser=";
    query_url += username + "&origin=*";
    query_url += "&guiprop=groups|editcount|merged";

    return fetch(query_url)
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("error")) {
          return null;
        }

        // return empty detail on error
        if (data.query.hasOwnProperty("globaluserinfo")) {
          user["registration"] = data.query.globaluserinfo.registration;
          user["rights"] = data.query.globaluserinfo.merged;
          user["home"] = user["rights"].reduce(
            (acc, cur) => (acc.editcount < cur.editcount ? cur : acc),
            { editcount: 0 }
          ).wiki;
          user["globalGroups"] = data.query.globaluserinfo.groups;
          user["editcount"] = data.query.globaluserinfo.editcount;

          // Extract homewiki url
          user["homeurl"] = user["rights"].filter(
            (item) => item.wiki === user["home"]
          )[0]["url"];

          // Pick only current wiki rights that are in relevant user groups
          user["rights"] = user["rights"].filter(
            (item) =>
              new URL(item.url).host === wiki &&
              "groups" in item &&
              item.groups.some((r) => relevantGroups.includes(r.toLowerCase()))
          );

          // Only consider relevant global groups
          user["globalGroups"] = user["globalGroups"].filter((item) =>
            relevantGlobalGroups.includes(item)
          );

          // sort by edit count
          user["rights"] = user["rights"].sort(
            (b, a) => a.editcount >= b.editcount
          );

          // Flatten results
          user["rights"] = user["rights"].map((item) => {
            item["groups"] = item["groups"].filter(
              (i) => relevantGroups.indexOf(i) >= 0
            );
            return item["groups"];
          });

          // item['groups'] in the above line returns an array.  Faced errors when doing otherwise for fiwiki's User:Stryn
          if (Array.isArray(user.rights[0])) user["rights"] = user["rights"][0];

          // append global groups and convert to comma separated list
          user["rights"] = [...user["rights"], ...user["globalGroups"]].join(
            ", "
          );

          return user;
        }
      })
      .catch((e) => {
        // console.log(`error: ${error}`)
        return null;
      });
  },

  /**
   * Search and get pages that match certain
   * keywords
   */
  getPages: async (pageInputContainer, wikiInputContainer) => {
    let pageInput = document.querySelector(pageInputContainer);
    let wikiInput = document.querySelector(wikiInputContainer);
    if (typeof wikiInput === "indefined" || wikiInput.value === "") {
      console.log("empty value");
      return Promise.resolve([]); // empty array
    }

    let query_url =
      "https://" + wikiInput.value + "/w/api.php?action=query&list=search";
    query_url += "&srsearch=" + pageInput.value + "&srnamespace=*";
    query_url += "&format=json&origin=*";

    source = await fetch(query_url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        let result = data.query.search.reduce((a, b) => a.concat(b.title), []);
        return result;
      })
      .catch((error) => {
        // console.log(`error: ${error}`)
        return [];
      });

    return source;
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
    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 15);
    lastMonth = lastMonth.toISOString();

    let apiURI = homewikiURI + "/w/api.php?action=query&list=usercontribs";
    apiURI +=
      "&uclimit=50&ucend=" +
      lastMonth +
      "&ucuser=" +
      username +
      "&format=json&origin=*";

    res = await fetch(apiURI)
      .then((data) => data.json())
      .then((recentEdits) => recentEdits.query.usercontribs)
      .catch();

    return res;
  },
};
