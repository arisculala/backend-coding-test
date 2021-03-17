# Xendit Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.

## Setup

1. Create a new repository in your own github profile named `backend-coding-test` and commit the contents of this folder
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`
6. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Tasks

Below will be your set of tasks to accomplish. Please work on each of these tasks in order. Success criteria will be defined clearly for each task

1. [Documentation](#documentation)
2. [Implement Tooling](#implement-tooling)
3. [Implement Pagination](#implement-pagination)
4. [Refactoring](#refactoring)
5. [Security](#security)
6. [Load Testing](#load-testing)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API response that is expected.

#### Success Criteria

1. A pull request against `master` of your fork with a clear description of the change and purpose and merge it
3. **[BONUS]** Create an easy way to deploy and view the documentation in a web format and include instructions to do so

#### How to test
```
1. Clone the remote repository backend-coding-test in your local machine (using the release tag documentation)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch documentation

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install

5. Run
   $ npm run start

6. Open in browser http://localhost:8010/api/docs/ to view the swagger api documentation

```


### Implement Tooling

Please implement the following tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

#### Success Criteria

1. Create a pull request against `master` of your fork with the new tooling and merge it
    1. `eslint` should have an opinionated format
    2. `nyc` should aim for test coverage of `80%` across lines, statements, and branches
    3. `pre-push` should run the tests before allowing pushing using `git`
    4. `winston` should be used to replace console logs and all errors should be logged as well. Logs should go to disk.
2. Ensure that tooling is connected to `npm test`
3. Create a separate pull request against `master` of your fork with the linter fixes and merge it
4. Create a separate pull request against `master` of your fork to increase code coverage to acceptable thresholds and merge it
5. **[BONUS]** Add integration to CI such as Travis or Circle
6. **[BONUS]** Add Typescript support

#### How to test
```
1. Clone the remote repository backend-coding-test in your local machine (using the release tag tooling)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch tooling

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install

5. To test if nyc is setup
   $ npm run test
      (This will display the number of code coverage percentage)
      For nyc code coverage, after you execute the command above, a directory (coverage) is created
         browse on the created directory and open the file index.html (converage -> lcov-report -> src -> index.html)

6. To test logger (I have setup winston as the logger)
   $ npm run start
      a directory name `logs` will be created inside the main project folder, two log file is also created as I setup the log severity error (error.log) and combine log info (info.log)

7. For lint I setup local vscode ide to automatically do the lint fix of the code

8. I have setup pre-push to do run all the test before allowing to push the commit changes to github.
   This will ensure that all test cases must be working properly before committing the changes to github.

```


### Implement Pagination

Please implement pagination to retrieve pages of the resource `rides`.

1. Create a pull request against `master` with your changes to the `GET /rides` endpoint to support pagination including:
    1. Code changes
    2. Tests
    3. Documentation
2. Merge the pull request

#### How to test
```
- I added limit, offset, column, sort parameters to make the pagination endpoint flexible

- Installed lodash for query parameter validation and setting of default value

1. Clone the remote repository backend-coding-test in your local machine (using the release tag pagination)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch pagination

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install

5. Run
   $ npm test
      (In the result, you will see additional test cases under GET /rides with pagination parameters)

6. Run
   $ npm run start

7. Open in browser
   http://localhost:8010/api/docs/
      (You should be able to see the additional input query parameters in GET: /rides - The query parameters will be use for pagination purpose)
      Under 'Schemas' of the swagger UI documentation,
         you will be able to see the definition and usage of the additional query parameters (limit, offset, column and sort)
```


### Refactoring

Please implement the following refactors of the code:

1. Convert callback style code to use `async/await`
2. Reduce complexity at top level control flow logic and move logic down and test independently
3. **[BONUS]** Split between functional and imperative function and test independently

#### Success Criteria

1. A pull request against `master` of your fork for each of the refactors above with:
    1. Code changes
    2. Tests

#### How to test
```
- Convert callback to async/await (using Promise)
-  Reduce complexity at top level control flow logic and move logic down and test independently
   -  removed existing code from app.ts
   -  created controller (rides-controller), service (rides-service), route (rides-route) and interface
   -  renamed api.test.ts to rides-router-test.ts and moved to tests/routes directory
   -  created rides-controller.test.ts for rides-controller.ts tests
   -  created rides-service.test.ts for rides-service.ts tests

1. Clone the remote repository backend-coding-test in your local machine (using the release tag refactoring)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch refactoring

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install

5. Run
   $ npm run test
      -  You should be able to see the nyc display of tests - Output percentage of tests coverage
      -  Additional test cases where added to cover functional and imperative function
         -  RidesController tests `rides-controller.test.ts`nto cover test cases for `rides-controller.ts`
         -  API tests `rides-routes.test.ts` to cover test cases for `rides-router.ts`
         -  RidesService tests `rides-service.test.ts` to cover test cases for `rides-service.ts`
6. Run
   $ npm run start

7. Open in browser
   http://localhost:8010/api/docs/
      (You should be able to see the existing swagger documentation UI - wherein you can use it to test the API's)
```



### Security

Please implement the following security controls for your system:

1. Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. A pull request against `master` of your fork with:
    1. Changes to the code
    2. Tests ensuring the vulnerability is addressed

#### How to test
```
-  Implemented parameterized when doing sqlite3 query
-  Implemented helmet to helps you secure your Express apps by setting various HTTP headers.

1. Clone the remote repository backend-coding-test in your local machine (using the release tag security)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch security

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install

5. Run
   $ npm run test
      (Additional testing under SQL Injection in the output)
      (You should be able to see the nyc display of tests - Output percentage of tests coverage)

6. Run
   $ npm run start

7. Open in browser
   http://localhost:8010/api/docs/
      (You should be able to see the existing swagger documentation UI - wherein you can use it to test the API's)
```


### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. Implement load testing using `artillery`
    1. Create a PR against `master` of your fork including artillery
    2. Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
    3. Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`

#### How to test
```
-  Added forever in the project to run/stop the application in a daemon
   -  start application using forever
         $ npm run start:forever
   -  stop daemon spin by forever
         $ npm run stop:forever
   -  to check the forever running process (you will be able to see the details of the spin up daemon)
         $ forever list

-  Implemented artillery for load testing of the API's
   -  run load testing command
         $ npm run test:load

1. Clone the remote repository backend-coding-test in your local machine (using the release tag load-testing)
   $ git clone https://github.com/arisculala/backend-coding-test.git --branch load-testing

2. Go inside the cloned backend-coding-test project
   $ cd backend-coding-test

3. Ensure node (>8.6 and <= 10) and npm are installed

4. Run
   $ npm install
   
5. Verify and check test cases are working, run
   $ npm run test

6. Spin up a daemon to run the application
   $ npm run start:forever
   
7. Verify if forever successfully spin up a daemon for the application, run
   $ forever list
      (You should be able to see the pid and details of the daemon process started by forever)

8. Run application load testing using artillery
   $ npm run test:load
      (You will be able to see the report generated by artillery based on the configuration I setup inside the file load-testing-artillery.json)

9. After the load testing, stop the daemon that was spin up by forever
   $ npm run stop:forever
   
10. Verify that the daemon process stop
   $ forever list
```



