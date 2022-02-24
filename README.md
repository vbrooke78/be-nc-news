LINK TO HOSTED VERSION

https://vbnews.herokuapp.com/

PROJECT SUMMARY

The aim of this back-end project was to create an Express server with API endpoints that interact with a PSQL database.
node-postgres was used to connect to the database.
The models query and deal with the data, while the controllers focus on error handling client's requests.

Node.js v16.13.0
Postgres v14.1

INSTRUCTIONS

Step 1 - How to clone this repo:

cd into the directory you want to clone into, then type:
git clone https://github.com/vbrooke78/be-nc-news.git
into your terminal.

Step 2 - Install devDependencies:

npm i -D to install the following dev dependencies:
jest - testing framework
jest-extended - adds additional matchers to Jest's default ones
jest-sorted - extension to allow to test using sorted-by
supertest - tests endpoints

Step 3 - Install dependencies:

npm i to install the following dependencies:
dotenv - loads environment variables
express - node.js web application framework
jest-json-matchers - additional matchers to prevent too many invocations of JSON.parse() and JSON.stringify()
pg-format - creates dynamic SQL queries
pg - interacts with the database

Step 4 - Connect to the database:

You will need to create two .env files for your project: .env.test and .env.development.
Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment
(see /db/setup.sql for the database names).
Double check that these .env files are .gitignored.

Step 5 - Run scripts:

The scripts in package.json should do the following:

Run setup.sql - drops and creates the databases
Run run-seed.js - seeds the database
Run jest - tests with a (re-seeded) test database
