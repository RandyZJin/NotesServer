# NotesServer
NotesServer is intended to be the backend API for an app that allows users to create, read, update, delete, search, and share notes.  Express would route the incoming requests and the database is stored using PSQL.

Automated Tests are included under the /test folder.

## Dev Dependencies
- Mocha
- Chai
- nodemon
- axios

Mocha and Chai are used for automated tests for both function and integration testing along with axios (for API calls).  Nodemon is used for running the server and monitoring changes to code to restart. 

## Dependencies

- bcryptjs : Used for password hashing.
- dotenv : Used for safe storage of keys.
- express : Framework for api.
- express-rate-limit : Used to impose a request limit.
- jsonwebtoken: Used to issue and authenticate tokens for access.
- pg : Used for integration with PSQL.
- nyc: Used for test coverage reporting.


## Setup

Install dependencies with `npm install`.  After installation finishes, create a .env file inside the main folder following the example.  If you do not already have PSQL databases created it will need to be created.

## Running Server

```sh
npm start
```
The default port is 3000;

## Running Test Framework

```sh
npm test
npm run test-with-coverage
```

Some tests will require the server to be running. Running "npm test" will only run the tests but "npm run test-with-coverage" will generate a coverage map.