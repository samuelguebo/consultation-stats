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

## Start the app

``` bash
# in development environment
yarn dev

# in production
webservice start
```

## Contributing
Feel free to flag bugs or submit pull requests!