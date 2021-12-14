## Consultation stats
A minimalist utility gathering stats about editors who participated in a Mediawiki-powered discussion. It can help visualize the level of participation by communities.

## Overview
![](https://tools-static.wmflabs.org/consultation-stats/consultation-stats-screenshot.png)

## Requirements
* [Yarn](https://classic.yarnpkg.com/en/docs/install) dependencies manager
* Wikimedia Tool account and access to database replicas. If you do not own a Wikimedia Tool account, please [see here how you can get one](https://wikitech.wikimedia.org/wiki/Portal:Toolforge/Tool_Accounts).

## Install
``` bash
# clone the repository
git clone https://github.com/samuelguebo/consultation-stats

# install dependencies
yarn install

# build and render frontend js
yarn build
```
## Configure
Database configuration such as server port or user credentials should be set in `app/setting.js`
In order to do so, copy `app/settings-sample.js` into a new file `app/settings.js` and make sure that it is not tracked but git, as it contains server information.

While doing development on your computer (localhost), you will need to adjust the database settings and open a set up a distant connection to Wikimedia replicas. Please [check here for detailed steps](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Database#Connecting_to_the_database_replicas_from_your_own_computer) about connecting to the database replicas from your own computer.

## Start the app

``` bash
# in development environment
node start

# in production
webservice start
```

## Contributing
Feel free to flag bugs or submit pull requests!