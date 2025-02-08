import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import ExperimentClient from '../src/tracking/ExperimentClient';
import { ApiError } from '../src/utils/apiError';
import {
  createTestExperiment,
  deleteTestExperiments,
  experimentProperties,
  ExpSearchResults,
  TRACKING_SERVER_URI,
} from './testUtils';

describe('ExperimentClient', () => {
  let experimentClient: ExperimentClient;
  const testIds: string[] = [];

  beforeAll(async () => {
    // Add a small delay to ensure MLflow is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    experimentClient = new ExperimentClient(TRACKING_SERVER_URI);
  });

  describe('createExperiment', () => {
    test('should create an experiment and return the experiment ID', async () => {
      const testExperimentId: string = await createTestExperiment();
      testIds.push(testExperimentId);
      expect(typeof testExperimentId).toBe('string');
      expect(testExperimentId).toBeTruthy();
    });

    test('should throw error if name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        ApiError
      );
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.createExperiment()).rejects.toThrow(
        /Error creating experiment from tracking server:/
      );
    });

    test('should throw error if name is already in use', async () => {
      const experimentName: string = `Test experiment ${Date.now()}`;
      testIds.push(await experimentClient.createExperiment(experimentName));
      await expect(
        experimentClient.createExperiment(experimentName)
      ).rejects.toThrow(ApiError);
    });
  });

  describe('searchExperiment', () => {
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) {
        const search: string = await experimentClient.createExperiment(
          `Search test ${Date.now()}`
        );
        testIds.push(search);
      }
    });

    test('should return valid search results', async () => {
      const results: ExpSearchResults = await experimentClient.searchExperiment(
        "name LIKE 'Search test%'",
        4
      );

      expect(results.experiments).toBeDefined();
      expect(results.next_page_token).toBeDefined();
      expect(results.experiments).toHaveLength(4);
      results.experiments?.forEach((result) => {
        for (const property of experimentProperties) {
          expect(result).toHaveProperty(property);
        }
      });
      expect(typeof results.next_page_token).toBe('string');
    });
  });

  describe('getExperiment', () => {
    test('should return experiment information', async () => {
      const expId: string = await createTestExperiment();
      const experiment = await experimentClient.getExperiment(expId);
      testIds.push(expId);
      for (const property of experimentProperties) {
        expect(experiment).toHaveProperty(property);
      }
    });

    test('should throw error if experiment ID is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.getExperiment()).rejects.toThrow(ApiError);
    });
  });

  describe('getExperimentByName', () => {
    test('should return experiment information', async () => {
      const name: string = `Test experiment ${Date.now()}`;
      testIds.push(await experimentClient.createExperiment(name));
      const experiment = await experimentClient.getExperimentByName(name);
      for (const property of experimentProperties) {
        expect(experiment).toHaveProperty(property);
      }
    });

    test('should throw error if experiment name is missing', async () => {
      // @ts-expect-error: testing for missing arguments
      await expect(experimentClient.getExperimentByName()).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('deleteExperiment', () => {
    test('should delete an experiment', async () => {
      const name: string = `Test experiment ${Date.now()}`;
      const idToDelete: string = await experimentClient.createExperiment(name);
      await experimentClient.deleteExperiment(idToDelete);
      const results: ExpSearchResults = await experimentClient.searchExperiment(
        `name LIKE '${name}'`,
        4
      );
      expect(results).toEqual({});
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(
        experimentClient.deleteExperiment('invalidExperimentId')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('restoreExperiment', () => {
    test('should restore a deleted experiment', async () => {
      const name: string = `Test experiment ${Date.now()}`;
      const idToDelete: string = await experimentClient.createExperiment(name);
      testIds.push(idToDelete);
      await experimentClient.deleteExperiment(idToDelete);
      await experimentClient.restoreExperiment(idToDelete);
      const results: ExpSearchResults = await experimentClient.searchExperiment(
        `name LIKE '${name}'`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(
        experimentClient.restoreExperiment('invalidExperimentId')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updateExperiment', () => {
    test("should update an experiment's name", async () => {
      const name: string = `Test experiment ${Date.now()}`;
      const exp: string = await experimentClient.createExperiment(name);
      testIds.push(exp);
      const updatedName: string = `${name}_UPDATE`;
      await experimentClient.updateExperiment(exp, updatedName);
      const results: ExpSearchResults = await experimentClient.searchExperiment(
        `name LIKE '${updatedName}'`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
      expect(results.experiments?.[0].experiment_id).toBe(exp);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(
        experimentClient.updateExperiment(
          'invalidExperimentId',
          'invalidExperimentIdUpdate'
        )
      ).rejects.toThrow(ApiError);
    });
  });

  describe('setExperimentTag', () => {
    test('should set a tag on an experiment', async () => {
      const date: number = Date.now();
      const name: string = `Test experiment ${date}`;
      const exp: string = await experimentClient.createExperiment(name);
      testIds.push(exp);
      await experimentClient.setExperimentTag(exp, 'tag1', `value${date}`);
      const results: ExpSearchResults = await experimentClient.searchExperiment(
        `tags.tag1 = "value${date}"`,
        4
      );
      expect(results.experiments).toBeDefined();
      expect(results.experiments).toHaveLength(1);
      expect(results.experiments?.[0].experiment_id).toBe(exp);
    });

    test('should throw error if invalid experiment ID is passed in', async () => {
      await expect(
        experimentClient.setExperimentTag(
          'invalidExperimentId',
          'tag1',
          'value1'
        )
      ).rejects.toThrow(ApiError);
    });
  });

  afterAll(async () => await deleteTestExperiments(testIds));
});
