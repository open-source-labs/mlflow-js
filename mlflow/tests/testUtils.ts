import ExperimentClient from '../src/tracking/ExperimentClient';
import { Experiment } from '../src/utils/interface';

export const TRACKING_SERVER_URI: string = 'http://127.0.0.1:5002';
export const experimentProperties: string[] = [
  'experiment_id',
  'name',
  'artifact_location',
  'lifecycle_stage',
  'last_update_time',
  'creation_time',
];
export const runProperties: string[] = [
  'run_id',
  'run_uuid',
  'run_name',
  'experiment_id',
  'user_id',
  'status',
  'start_time',
  'artifact_uri',
  'lifecycle_stage',
];
export type ExpSearchResults = {
  experiments?: Experiment[];
  next_page_token?: string;
};

const experimentClient = new ExperimentClient(TRACKING_SERVER_URI);

export const createTestExperiment = async (
  prefix = 'Test experiment'
): Promise<string> => {
  const timestamp = Date.now();
  return await experimentClient.createExperiment(`${prefix} ${timestamp}`);
};

export const deleteTestExperiments = async (experimentIds: string[]) => {
  for (const id of experimentIds) {
    try {
      await experimentClient.deleteExperiment(id);
    } catch (err) {
      console.warn(`Failed to delete experiment ${id}: ${err}`);
    }
  }
};
