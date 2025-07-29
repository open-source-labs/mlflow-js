import ExperimentClient from '../tracking/ExperimentClient.js';
import RunClient from '../tracking/RunClient.js';
import { ApiError } from '../utils/apiError.js';
class ExperimentManager {
    constructor(trackingUri) {
        this.experimentClient = new ExperimentClient(trackingUri);
        this.runClient = new RunClient(trackingUri);
    }
    /**
     * Full workflow of creating, naming and starting a run under an existing experiment (referenced by ID),
     * logging metrics, params, and tags, logging the model, and finishing the run.
     *
     * @param {string} experiment_id ID of the experiment under which to log the run.  (required)
     * @param {string} run_name Name of the run to be created and run (optional)
     * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics] The metrics to log (up to 1000 metrics) (optional)
     * @param {Array<{key: string, value: string}>} [params] The params to log (up to 100 params) (optional)
     * @param {Array<{key: string, value: string}>} [tags] The tags to log (up to 100 tags) (optional)
     * @param {{artifact_path: string, flavors: Object, model_url: string, model_uuid: string, utc_time_created: number, mlflow_version: string}} model The ML model data to log to the run, represented as a Javascript object (optional)
     * @returns {Promise<Object>} The created run object with updated metadata
     */
    async runExistingExperiment(experiment_id, run_name, metrics, params, tags, model) {
        try {
            // create run
            const run = await this.runClient.createRun(experiment_id, run_name);
            const run_id = run.info.run_id;
            // log metric, params, and tags via logBatch
            await this.runClient.logBatch(run_id, metrics, params, tags);
            // log model
            // (model gets passed in as a JS object, not JSON - it gets JSON stringified here after adding a run_id property)
            if (model) {
                model.run_id = run_id;
                const model_json = JSON.stringify(model);
                await this.runClient.logModel(run_id, model_json);
            }
            // updateRun to finish it
            const latestRun = await this.runClient.updateRun(run_id, 'FINISHED');
            return latestRun.run_info;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            else {
                throw new Error();
            }
        }
    }
    /**
     * Full workflow of creating, naming and starting a run under a new experiment,
     * logging metrics, params, and tags, logging the model, and finishing the run.
     *
     * @param {string} experiment_name Name of the experiment under which to log the run.  (required)
     * @param {string} run_name Name of the run to be created and run (optional)
     * @param {Array<{key: string, value: number, timestamp: number, step?: number}>} [metrics] The metrics to log (up to 1000 metrics) (optional)
     * @param {Array<{key: string, value: string}>} [params] The params to log (up to 100 params) (optional)
     * @param {Array<{key: string, value: string}>} [tags] The tags to log (up to 100 tags) (optional)
     * @param {Object} model The ML model data to log to the run, represented as a Javascript object (optional)
     * @returns {Promise<Object>} The created run object with updated metadata
     */
    async runNewExperiment(experiment_name, run_name, metrics, params, tags, model) {
        try {
            const experiment_id = await this.experimentClient.createExperiment(experiment_name);
            // create run
            const run = await this.runClient.createRun(experiment_id, run_name);
            const run_id = run.info.run_id;
            // log metric, params, and tags via logBatch
            await this.runClient.logBatch(run_id, metrics, params, tags);
            // log model
            // (model gets passed in as a JS object, not JSON - it gets JSON stringified here after adding a run_id property)
            if (model) {
                model.run_id = run_id;
                const model_json = JSON.stringify(model);
                await this.runClient.logModel(run_id, model_json);
            }
            // updateRun to finish it
            const latestRun = await this.runClient.updateRun(run_id, 'FINISHED');
            return latestRun.run_info;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            else {
                throw new Error();
            }
        }
    }
    /**
     * Returns an array of all the passed-in experiment's runs, sorted according to the passed-in metric
     *
     * @param {string} experiment_id The experiment whose runs will be evaluated (required)
     * @param {string} primaryMetric The metric by which the results array will be sorted (required)
     * @param {string | number} order Sort order for the array: pass in 'DESC' or 1 for descending; 'ASC' or -1 for ascending
     * @returns {Promise<Array<Object>>} An array of run objects belonging to the passed-in experiment ID, sorted according to the primary metric
     */
    async experimentSummary(experiment_id, primaryMetric, order) {
        try {
            // use Search Runs to return all runs whose experiment ID matches the passed in one
            // use Search Runs's order_by field to sort results array by primaryMetric
            let orderString;
            if (order === 1 || order === 'DESC')
                orderString = 'DESC';
            else if (order === -1 || order === 'ASC')
                orderString = 'ASC';
            const arg = `metrics.${primaryMetric} ${orderString}`;
            const data = await this.runClient.searchRuns([experiment_id], '', undefined, undefined, [arg]);
            data.runs.forEach((el) => {
                const arr = el.data.metrics;
                let val;
                arr.forEach((obj) => {
                    if (obj.key === primaryMetric)
                        val = obj.value;
                });
                el[primaryMetric] = val;
            });
            return data.runs;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            else {
                throw new Error();
            }
        }
    }
}
export default ExperimentManager;
//# sourceMappingURL=ExperimentManager.js.map