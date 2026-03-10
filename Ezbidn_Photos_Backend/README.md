# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|CORS           | Cors accepted values            | "localhost:3000"      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 22.14.0
- Database [MY SQL]


# Getting started
- Clone the repository
```
git clone
```
- Install dependencies
```
cd ezbidn_api
npm install
```
- Build and run the project
```
npm run dev
```
  Navigate to `http://localhost:1012`

- API Document endpoints

  swagger-ui  Endpoint : http://localhost:1012/api-docs 


# Javascript + Node 
The Rest APIs will be using the Swagger (OpenAPI) Specification.


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your Javascript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **emailtemplates**       | Contains all email temaplates 
| **src/controllers**      | Controllers define various express routes, separated by modules of application. 
| **src/services**         | Services define functions for routes.  
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contains common routes                      
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/utils**            | All common functions and services |
| **src**/app.js           | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)/ |

## Building the project

### Running the build
All the different build steps are orchestrated via [npm scripts].
Npm scripts basically allow us to call (and chain) terminal commands via npm. Before creating new build, Need to delete old dist folder

| Npm Script                | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `server`                  | Runs full build and runs node on dist/app.js.                  |
| `build-staging`           | Create new dist filder. Copy .env.staging file to .env     |
| `build-dev`               | Create new dist filder. Copy .env.dev file to .env      |
| `dev`                     | Runs code without build. `npm run dev`|
