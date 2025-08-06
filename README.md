<div style="text-align: center">
<img src="/mlflow-site/public/assets/mlflow-js-logo-whitebg.png" width=600px;"/></div>

<br>

## About

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE)
![Release](https://img.shields.io/badge/Release-v1.0.1-426B20)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/Coverage-87%25-c7ea46.svg)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](/CONTRIBUTING.md)

<i>MLflow.js</i> is an open-source JavaScript library that helps developers track machine learning experiments and manage models with MLflow, providing functionalities for machine learning lifecycle in JavaScript/TypeScript environments.

<br>

## Features

<i>MLflow.js</i> covers all REST API endpoints under MLflow's Tracking Server and Model Registry. Moreover, high-level abstractions have been developed to facilitate developers' common ML workflows. It provides some key advantages:

- Native JavaScript Integration: Seamlessly integrate MLflow capabilities within JavaScript codebases
- Type Safety: Built with TypeScript for enhanced developer experience and code reliability
- Modular Architecture: Designed with object-oriented structure that mirrors MLflow's concepts while being extensible and maintainable
- Client-side ML Compatibility: Complements popular JavaScript libraries like TensorFlow.js, enabling ML deployment directly in the browser or client side

<br>

## Built with

[![TypeScript](https://img.shields.io/badge/TypeScript-0077B5?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-000435?style=for-the-badge&logo=javascript&logoColor=00fff)](https://www.javascript.com/)
[![React](https://img.shields.io/badge/React-36454F?style=for-the-badge&logo=React&logoColor=00fff)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-24292e?style=for-the-badge&logo=next.js&logoColor=00fff)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-008080?style=for-the-badge&logo=tailwindcss&logoColor=bfffff)](https://tailwindcss.com/)
[![ESLINT](https://img.shields.io/badge/ESLINT-4B32C3?style=for-the-badge&logo=eslint&logoColor=bfffff)](https://eslint.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)](https://nodejs.org/en/)
[![Jest](https://img.shields.io/badge/Jest-800020?style=for-the-badge&logo=jest&logoColor=00fff)](https://jestjs.io/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-30363d?style=for-the-badge&logo=github&logoColor=00fff)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-lightblue?style=for-the-badge&logo=Docker&logoColor=00fff)](https://www.docker.com/)
[![NPM](https://img.shields.io/badge/NPM-CC3534?style=for-the-badge&logo=npm&logoColor=00fff)](https://www.npmjs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-966FD6?style=for-the-badge&logo=Vercel&logoColor=00fff)](https://vercel.com/)

<br>

## Prerequisites

### Set Up MLflow

Ensure MLflow is installed on your system:

```bash
pip install mlflow
```

**Note:** MLflow is compatible with MacOS. If you encounter issues with the default system Python, consider installing Python 3 via the Homebrew package manger using `brew install python`. In this case, installing MLflow is now `pip3 install mlflow`.

### Start the MLflow Tracking Server

To start the MLflow tracking server locally, use the following command:

```bash
mlflow ui --port 5001
```

This will launch the MLflow UI on your local machine at `http://localhost:5001`.

### Alternative Docker approach to the MLflow Tracking Server

Install [Docker Desktop](https://www.docker.com/).

To start the MLflow tracking server locally, use the following commands:

```bash
docker pull ghcr.io/mlflow/mlflow
docker run -p 5001:5001 ghcr.io/mlflow/mlflow:latest mlflow server --host 0.0.0.0 --port 5001
```

This will launch the MLflow UI on your local machine at `http://localhost:5001`.

### Development Setup

For development environment setup instructions, please refer to our [Contributing Guide](/CONTRIBUTING.md).

<br>

## Quickstart

### Install <i>mlflow.js</i> Library

To use the <i>mlflow.js</i> library, navigate to your project directory and install it via npm:

```bash
npm install mlflow-js
```

### Usage Example

Here is an example of how to use the <i>mlflow.js</i> library to create an experiment:

```JavaScript
import Mlflow from 'mlflow-js';

// Initialize the MLflow client
// If your tracking server requires a token please also set env variable MLFLOW_TRACKING_TOKEN
// export MLFLOW_TRACKING_TOKEN = "{token}"
const mlflow = new Mlflow(process.env.MLFLOW_TRACKING_URI);

// Create a new experiment
async function createExperiment(){
	await mlflow.createExperiment('My Experiment');
	console.log('Experiment created successfully');
}

createExperiment();

```

<br>

## Resources

- [Example Repository](https://github.com/oslabs-beta/mlflow-js/tree/dev/mlflow/examples) - Practical examples demonstrating <i>MLflow.js</i>'s functionality
- [Quick Tutorials](https://www.mlflow-js.org/) - Video walkthrough of the example code with MLflow UI
- [Read our Medium Article](link) - Overview on why we built <i>MLflow.js</i> and how it enhances ML workflows in JavaScript environments

<br>

## Documentation

Official documentation for <i>MLflow.js</i> can be found <a href="https://www.mlflow-js.org/documentation">here</a>.

### High-Level Workflows

**Experiment Manager**

- runExistingExperiment - Full workflow of creating, naming, and starting a run under an existing experiment, logging metrics, params, tags, and the model, and finishing the run
- runNewExperiment - Full workflow of creating, naming, and starting a run under a new experiment, logging metrics, params, tags, and the model, and finishing the run
- experimentSummary - Returns an array of all the passed-in experiment's runs, sorted according to the passed-in metric

**Run Manager**

- cleanupRuns - Deletes runs that do not meet certain criteria and return an object of deleted runs and details
- copyRun - Copies a run from one experiment to another (without artifacts and models)

**Model Manager**

- createRegisteredModelWithVersion - Creates a new registered model and the first version of that model
- updateRegisteredModelDescriptionAndTag - Updates a registered model's description and tags
- updateAllLatestModelVersion - Updates the latest version of the specified registered model's description, adds a new alias, and tag key/value for the latest version
- setLatestModelVersionTag - Adds a new tag key/value for the latest version of the specified registered model
- setLatestModelVersionAlias - Adds an alias for the latest version of the specified registered model
- updateLatestModelVersion - Updates the description of the latest version of a registered model
- updateAllModelVersion - Updates the specified version of the specified registered model's description and adds a new alias and tag key/value for that specified version
- deleteLatestModelVersion - Deletes the latest version of the specified registered model
- createModelFromRunWithBestMetric - Creates a new model with the specified model name from the run with the best specified metric

<br>

## Contributing

We welcome contributions to <i>MLflow.js</i>! Please see our [Contributing Guide](/CONTRIBUTING.md) for more details on how to get started.

<br>

## License

[MIT License](/LICENSE)

<br>

## Meet The Team

| Name           | GitHub                                                                                                                    | LinkedIn                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Yiqun Zheng    | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/yiqunzheng)    | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yiqunzheng/)   |
| Kyler Chiago   | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Kyler-Chiago)  | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kyler-chiago/) |
| Austin Fraser  | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/austinbfraser) | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](http://www.linkedin.com/in/austin-fraser)  |
| Stephany Ho    | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/seneyu)        | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/stephanyho/)   |
| Winston Ludlam | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/winjolu/)      | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wjludlam/)     |
