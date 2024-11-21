# Project Setup and Test Instructions

## Project Structure

This project is structured as follows:

``` 
.github/workflows/playwright.yml
allure-report
jsonReports
src/jsonSchemas
src/services/users
src/test-data
src/tests
src/utils
.env
.prettierrc
package.json 
```

## Project Setup
### Prerequisites
Project Setup and Test Instructions
1. Contains API service functions
2. Contains JSON schema files for validation
3. Contains test data generators
4. Contains test scripts
5. Contains utility functions (e.g., schema validator)
6. Allure test report output
7. Project dependencies and scripts

Ensure the following tools are installed on your machine:

- **Node.js** (version 14.x or higher)
- **NPM** (Node Package Manager)
- **Allure Commandline** (for generating the test reports)

You can check if you have Node.js and NPM installed by running:
```bash node -v npm -v ```

### Installation Steps

1. **Clone the Repository:**
Clone the project repository using Git:

```bash
git clone <repository-url> 
```

2. **Install Dependencies:**
Navigate to the project folder and install the required dependencies using npm:
```bash
cd <project-directory>

npm install 
```

3. **Install Allure Commandline:**
Allure is used for generating test reports. To install Allure Commandline globally, run:
```bash
npm install -g allure-commandline --save-dev 
```

## Running Tests
### 1. **Run Tests with Playwright:**
Before you run the tests go to https://gorest.co.in/public and create your own Bearer Token. Then create .env file and add your token into .env file as API_TOKEN=YOUR_TOKEN

To execute all the tests, use the following command:
```bash
npx playwright test 
```
This will run the Playwright tests defined in the `src/tests/` directory.

### 2. **Generate Allure Report:**
After the tests have been executed, you can generate an Allure report with the following steps:

- Run the tests with the `--reporter=list` option:
```bash
npx playwright test --reporter=list 
```
- Generate the Allure report using the following command:
```bash
npx allure generate allure-results --clean -o allure-report 
```
- Finally, open the Allure report in your default browser:
```bash
npx allure open allure-report 
```

## Test Details

### Test Framework: Playwright
This project uses Playwright as the end-to-end testing framework, with the following structure:
- **Positive Tests**: Verifying successful API requests (e.g., valid user creation, updating, deletion).
- **Negative Tests**: Verifying error responses for invalid or unauthenticated actions.

### Test Reports
Test reports are generated using **Allure**. The reports provide a clear view of test execution results, including passed and failed tests, logs, and more.

### Test Validation
For each API test, responses are validated against predefined JSON schemas. These schemas are located in the `src/jsonSchemas/` directory.

## Contributing
Feel free to contribute to the project by following these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the changes to your fork 
5. Create a pull request


## Allure Test Report Example Image
<img width="1728" alt="Screenshot 2024-11-21 at 22 58 26" src="https://github.com/user-attachments/assets/46948622-f686-40dd-a964-382b49c43b21">

