# Project Description: Build A Storefront Backend

A backend API for an online store is created in Nodejs.
The frontend developer will use the RESTful API that is exposed on the frontend. in order to create a complete front and backend STORE.

**For Testing**
-  Jasmine

**Install dependencies:** 
- *npm i* or *yarn*

**Start Server**
 - *npm run start*

**Testing using Jamine:** 
- *npm run test*

**Linting:**
 - *npm run lint*

**Prettier:** 
- *npm run format*

**Packages**
* express
* typescript
* db-migrate
* bcrypt
* nodemon
* jsonwebtoken
* jasmine
* supertest
* pg


## Database Configuration

 **Create Databases**
- connect to the postgres database using 
- *psql -U postgres*
- then run following command 
*CREATE USER postgres WITH PASSWORD '1234';* --> put your password when install postgres

 create the dev and test databases
  - *CREATE DATABASE storefront_dev;*
  - *CREATE DATABASE storefront_test;*

- Connect to the databases using *\c*
  - *\c storefront_dev*
  - *\c storefront_test*


  **Create Migration folders**

  Run the following commands depend on number of needed tables
  - *npx db-migrate create users table --sql-file*
  - *npx db-migrate create products table --sql-file*
  - *npx db-migrate create orders table --sql-file*
  - *npx db-migrate create order_products table --sql-file*

**Migrate Database**
- *yarn db-migrate up* or *npm run db-migrate up*

**Reset Database**
- *yarn db-migrate reset* or *npm run db-migrate reset*

**Enviromental Variables**

The environmental variables that needs to be set in a `.env` file as follow:

PORT=3000
ENV=dev
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
SALT_ROUNDS=10
PEPPER=PEPPER
TOKEN_SECRET=TOKEN_SECRET







