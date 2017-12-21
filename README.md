# Matcha

## Introduction
Dating Website made by 42 Students using: <br/>
* Node.js
* Express.js
* Socket.io
* MongoDB
* EJS Template
* Bootstrap

## Installation

### Install dependencies
Before installing make sure you have installed [Node.js](https://nodejs.org/en/).
``` shell
$ npm install
```

### Import users into database using MongoDB
Before entering all the commands below, make sure [MongoDB](https://www.mongodb.com/download-center?ct=atlasheader#community) is installed
``` shell
$ /usr/local/mongodb/mongoimport --db matcha --collection users --drop --file /mnt/c/42/matcha/public/dump/users.json --jsonArray
$ /usr/local/mongodb/mongo
$ /usr/local/mongodb/bin/mongod --dbpath ~/42/matcha/
$ /usr/local/mongodb/bin/mongoimport --db matcha --collection users --drop --file /*PROJECT_PATH*/public/dump/users.json
$ /usr/local/mongodb/bin/mongoimport --db matcha --collection views --drop --file /*PROJECT_PATH*/public/dump/views.json
$ /usr/local/mongodb/bin/mongo
$ use matcha
$ db.users.createIndex({location: "2dsphere"})
```
### Start 
``` shell
$ npm start
```