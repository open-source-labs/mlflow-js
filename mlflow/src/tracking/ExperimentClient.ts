import { ApiError } from '@utils/apiError';
import { apiRequest } from '@utils/apiRequest';

class ExperimentClient {
  trackingUri: string;
  constructor(trackingUri: string) {
    this.trackingUri = trackingUri;
  }

  /**
   * Create an experiment with a name. Returns the ID of the newly created experiment.
   * Validates that another experiment with the same name does not already exist and fails if another experiment with the same name already exists.
   *
   * @param {string} name Experiment name.  (required)
   * @param {string} artifact_location Optional location where all artifacts for the experiment are stored.  If not provided, the remote server will select an appropriate default.
   * @param {Array<{key: string, value: string}>} tags Optional collection of tags to set on the experiment.
   * @returns {Promise<string>} Returns the ID of the newly created experiment in an object.
   * @throws {ApiError} If the API request fails
   */
  async createExperiment(
    name: string, 
    artifact_location?: string, 
    tags?: Array<{key: string, value: string}>
  ): Promise<string> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/create',
      {
        method: 'POST',
        body: { name, artifact_location, tags },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error creating experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }
   
    return data.experiment_id;
  }

  /**
   * Search experiments.
   *
   * @param {string} filter A filter expression over experiment attributes and tags that allows returning a subset of experiments.  The syntax is a subset of SQL.  (required)
   * @param {number} max_results Maximum number of experiments desired.  (required)
   * @param {string} page_token Optional token indicating the page of experiments to fetch.
   * @param {string[]} order_by Optional list of columns for ordering search results.
   * @param {string} view_type Optional qualifier for type of experiments to be returned.  See https://mlflow.org/docs/latest/rest-api.html#mlflowviewtype
   * @returns {Promise<Object>} Returns object containing an array of experiment objects matching the filter,
   *    and optionally a next_page_token that can be used to retrieve the next page of experiments.
   * @throws {ApiError} If the API request fails
   */
  async searchExperiment(
    filter: string,
    max_results: number,
    page_token?: string,
    order_by?: string[],
    view_type?: string
  ): Promise<object> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/search',
      {
        method: 'POST',
        body: { filter, max_results, page_token, order_by, view_type },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error searching for experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    return data;
  }

  /**
   * Get metadata for an experiment, querying by experiment ID. This method works on deleted experiments.
   *
   * @param {string} experiment_id ID of the associated experiment.  (required)
   * @returns {Promise<Object>} Returns object containing the matched experiment.
   * @throws {ApiError} If the API request fails
   */
  async getExperiment(
    experiment_id: string
  ): Promise<object> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/get',
      {
        method: 'GET',
        params: { experiment_id }
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error getting experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    return data.experiment;
  }

  /**
   * Get metadata for an experiment, querying by experiment name.
   * This endpoint will return deleted experiments,
   * but prefers the active experiment if an active and deleted experiment share the same name.
   * If multiple deleted experiments share the same name, the API will return one of them.
   *
   * @param {string} experiment_name ID of the associated experiment.  (required)
   * @returns {Promise<Object>} Returns object containing the matched experiment.
   * @throws {ApiError} If the API request fails
   */
  async getExperimentByName(
    experiment_name: string
  ): Promise<object> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/get-by-name',
      {
        method: 'GET',
        params: { experiment_name }
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error getting experiment by name from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }

    return data.experiment;
  }

  /**
   * Mark an experiment for deletion.
   *
   * @param {string} experiment_id ID of the associated experiment.  (required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
   */
  async deleteExperiment(
    experiment_id: string
  ): Promise<void> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/delete',
      {
        method: 'POST',
        body: { experiment_id },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error deleting experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    };
  }

  /**
   * Restore an experiment marked for deletion.
   *
   * @param {string} experiment_id ID of the associated experiment.  (required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
   */
  async restoreExperiment(
    experiment_id: string
  ): Promise<void> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/restore',
      {
        method: 'POST',
        body: { experiment_id },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error restoring experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }
  }

  /**
   * Update experiment name.
   *
   * @param {string} experiment_id ID of the associated experiment. (required)
   * @param {string} new_name The experiment’s name is changed to the new name. The new name must be unique. (required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
   */
  async updateExperiment(
    experiment_id: string, 
    new_name: string
  ): Promise<void> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/update',
      {
        method: 'POST',
        body: { experiment_id, new_name },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error updating experiment from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }
  }

  /**
   * Set a tag on an experiment.
   *
   * @param {string} experiment_id ID of the experiment under which to log the tag. (required)
   * @param {string} key Name of the tag.  (required)
   * @param {string} value String value of the tag being logged.  (required)
   * @returns {Promise<void>}
   * @throws {ApiError} If the API request fails
   */
  async setExperimentTag(
    experiment_id: string, 
    key: string, 
    value: string
  ): Promise<void> {

    const { response, data } = await apiRequest(
      this.trackingUri,
      'experiments/set-experiment-tag',
      {
        method: 'POST',
        body: { experiment_id, key, value },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `Error setting tag from tracking server: ${
          data.message || response.statusText
        }`,
        response.status
      );
    }
  }
}

export default ExperimentClient;