import ExperimentClient from '../src/tracking/ExperimentClient';
import { Experiment, Metrics, Params, Tags } from '../src/utils/interface';

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

export const TEST_DATA = {
  metrics: [
    { key: 'accuracy', value: 0.83, timestamp: 1694000700000 },
    { key: 'loss', value: 0.18, timestamp: 1694000700000 },
  ] as Metrics[],
  params: [
    { key: 'learning_rate', value: '0.0001' },
    { key: 'batch_size', value: '256' },
  ] as Params[],
  tags: [
    { key: 'model_type', value: 'GradientBoosting' },
    { key: 'data_version', value: 'v1.7' },
  ] as Tags[],
  validModel: {
    artifact_path: 'pytorch_dnn',
    flavors: {
      python_function: {
        env: 'conda.yaml',
        loader_module: 'mlflow.pytorch',
        model_path: 'model.pth',
        python_version: '3.8.10',
      },
      pytorch: {
        model_data: 'model.pth',
        pytorch_version: '1.9.0',
        code: 'model-code',
      },
    },
    utc_time_created: '2023-09-14 10:15:00.000000',
  },
};

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
