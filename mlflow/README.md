<!-- README for NPM; the one for GitHub is in .github directory. -->

# MLflow.js

A JavaScript library designed to provide seamless integration with MLflow's REST API. This package offers access to all the essential endpoints for both the MLflow Tracking Server and Model Registry, along with high-level abstraction workflows, enabling efficient management of machine learning experiments and model lifecycle.

Note: MLflow.js is a community-maintained project and is not affiliated with or endorsed by Databricks or the official MLflow maintainers.

# Install

```bash
npm install mlflow-js
```

# Usage

An example of how to create an experiment:

```javascript
import Mlflow from 'mlflow-js';

// Initialize the MLflow client
const mlflow = new Mlflow(process.env.MLFLOW_TRACKING_URI);

// Create a new experiment
async function createExperiment() {
  await mlflow.createExperiment('My Experiment');
  console.log('Experiment created successfully');
}

createExperiment();
```

# Documentation

See [https://www.mlflow-js.org/documentation](https://www.mlflow-js.org/documentation)

# API

## Tracking Server

- Experiment Client (8)
  - Create Experiment, Search Experiment, Get Experiment, Get Experiment By Name, Delete Experiment, Restore Experiment, Update Experiment, Set Experiment Tag
- Run Client (15)
  - Create Run, Delete Run, Restore Run, Get Run, Update Run, Log Metric, Log Batch, Log Model, Log Inputs, Set Tag, Delete Tag, Log Param, Get Metric History, Search Runs, List Artifacts

## Model Registry

- Model Registry Client (12)
  - Create, Registered Model, Get Registered Model, Rename Registered Model, Update Registered Model, Delete Registered Model, Get Latest Model Versions, Search Registered Models, Set Registered Model Tag, Delete Registered Model Tag, Set Registered Model Alias, Delete Registered Model Alias, Get Model Version By Alias
- Model Version Client (9)
  - Create Model Version, Get Model Version, Update Model Version, Search Model Versions, Get Download URI for Model Version Artifacts, Transition Model Version Stage, Set Model Version Tag, Delete Model Version Tag, Delete Model Version

## High-Level Abstraction Workflows

- Experiment Manager (3)
  - Run Existing Experiment, Run New Experiment, Experiment Summary
- Run Manager (2)
  - Cleanup Runs, Copy Run
- Model Manager (9)
  - Create Registered Model With Version, Update Registered Model Description And Tag, Update All Latest Model Version, Set Latest Model Version Tag, Set Latest Model Version Alias, Update Latest Model Version, Update All Model Version, Delete Latest Model Version, Create Model From Run With Best Metric
