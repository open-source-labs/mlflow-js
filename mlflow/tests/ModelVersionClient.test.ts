import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import ModelVersionClient from '../src/model-registry/ModelVersionClient';
import ModelRegistryClient from '../src/model-registry/ModelRegistryClient';
import RunClient from '../src/tracking/RunClient';

interface keyable {
  [key: string]: any;
}

describe('ModelVersionClient', () => {
  let modelVersionClient: ModelVersionClient;
  let modelRegistryClient: ModelRegistryClient;
  let runClient: RunClient;
  let run: keyable;
  let modelName: string;
  let modelVersionRunLink: string;
  let modelVersionDescription: string;

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    modelRegistryClient = new ModelRegistryClient('http://localhost:5002');
    modelVersionClient = new ModelVersionClient('http://localhost:5002');
    runClient = new RunClient('http://localhost:5002');

    const timestamp = Date.now();
    modelName = `test-model-${timestamp}`;
    modelVersionRunLink = 'test-run-link';
    modelVersionDescription = 'test-model-version-description';
    // Creating a new registered model to test on
    await modelRegistryClient.createRegisteredModel(
      modelName,
      [{ key: 'test-tag', value: 'test-value' }],
      'This is a test model'
    );

    run = await runClient.createRun('0'); // Using '0' as the default experiment ID
  });

  describe('createModelVersion', () => {
    test('Should create a new model version with name, source, run_id, tag, run_link, and description', async () => {
      const createdModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );

      expect(createdModelVersion.name).toBe(modelName);
      expect(createdModelVersion.source).toBe(run.info.artifact_uri);
      expect(createdModelVersion.run_id).toBe(run.info.run_id);

      // ensure tags contain specified items regardless of order
      expect(createdModelVersion.tags).toEqual(
        expect.arrayContaining([
          { key: 'test-tag', value: 'test-value' },
          { key: 'test-tag2', value: 'test-value2' },
        ])
      );
      expect(createdModelVersion.tags.length).toBe(2);

      expect(createdModelVersion.run_link).toBe(modelVersionRunLink);
      expect(createdModelVersion.description).toBe(modelVersionDescription);
    });

    test('Should make version two of model version if passed same name', async () => {
      const createdModelVersion2: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      expect(createdModelVersion2.version).toBe('2');
    });

    test('Should throw if no parameters are passed to the method', async () => {
      // @ts-expect-error: Trying to use 0 parameters when parameters are required
      await expect(modelVersionClient.createModelVersion()).rejects.toThrow();
    });
  });

  describe('getModelVersion', () => {
    test('Should get the specified version of a model with specified name and version', async () => {
      const getModelVersionCreatedVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri
        );

      const retrievedModelVersion: keyable =
        await modelVersionClient.getModelVersion(
          modelName,
          getModelVersionCreatedVersion.version
        );
      expect(retrievedModelVersion.name).toBe(modelName);
      expect(retrievedModelVersion.version).toBe(
        getModelVersionCreatedVersion.version
      );
    });

    test('Should throw if no parameters are passed to the method', async () => {
      // @ts-expect-error: Trying to use 0 parameters when parameters are required
      await expect(modelVersionClient.getModelVersion()).rejects.toThrow();
    });
  });

  describe('updateModelVersion', () => {
    test("Should update the specified model version's description", async () => {
      await modelVersionClient.createModelVersion(
        modelName,
        run.info.artifact_uri,
        run.info.run_id,
        [
          { key: 'test-tag', value: 'test-value' },
          { key: 'test-tag2', value: 'test-value2' },
        ],
        modelVersionRunLink,
        modelVersionDescription
      );
      const updatedModelVersionDescription =
        "This is test version 1's updated description";
      const updatedModelVersionDescriptionObject: keyable =
        await modelVersionClient.updateModelVersion(
          modelName,
          '1',
          updatedModelVersionDescription
        );
      expect(updatedModelVersionDescriptionObject.description).toBe(
        updatedModelVersionDescription
      );
    });

    test('Should throw if no parameters are passed to the method', async () => {
      // @ts-expect-error: Trying to use 0 parameters when parameters are required
      await expect(modelVersionClient.updateModelVersion()).rejects.toThrow();
    });
  });

  describe('searchModelVersions', () => {
    test('Should retrieve an array of model_versions that match specified criteria', async () => {
      for (let i = 0; i < 7; i++) {
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      }
      const max_results = 5;
      const filteredModelVersions: keyable =
        await modelVersionClient.searchModelVersions(
          `name='${modelName}'`,
          max_results,
          ['name']
        );
      if (filteredModelVersions.next_page_token) {
        expect(typeof filteredModelVersions.next_page_token).toBe('string');
      }
      expect(filteredModelVersions).not.toHaveLength(0);
      for (let x = 0; x < max_results; x++) {
        expect(filteredModelVersions[x].name).toBe(modelName);
      }
    });

    test('Should return up to 200,000 models if no input is passed', async () => {
      await modelVersionClient.createModelVersion(
        modelName,
        run.info.artifact_uri,
        run.info.run_id,
        [
          { key: 'test-tag', value: 'test-value' },
          { key: 'test-tag2', value: 'test-value2' },
        ],
        modelVersionRunLink,
        modelVersionDescription
      );
      const testData = await modelVersionClient.searchModelVersions();
      expect(testData).not.toHaveLength(0);
    });
  });

  describe('getDownloadUriForModelVersionArtifacts', () => {
    test('Should retrieve the download uri for model version artifacts.', async () => {
      const getDownloadUriForModelVersionArtifactsModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      const artifact_uri =
        await modelVersionClient.getDownloadUriForModelVersionArtifacts(
          modelName,
          getDownloadUriForModelVersionArtifactsModelVersion.version
        );
      expect(artifact_uri).toBe(
        getDownloadUriForModelVersionArtifactsModelVersion.source
      );
    });

    test('Should throw if no parameters are passed to the method', async () => {
      await expect(
        // @ts-expect-error: Trying to use 0 parameters when parameters are required
        modelVersionClient.getDownloadUriForModelVersionArtifacts()
      ).rejects.toThrow();
    });
  });

  describe('transitionModelVersionStage', () => {
    test('Should transition the model version to a different stage', async () => {
      const transitionModelVersionStageModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      expect(transitionModelVersionStageModelVersion.current_stage).toBe(
        'None'
      );

      const transitionedModelVersion: keyable =
        await modelVersionClient.transitionModelVersionStage(
          modelName,
          transitionModelVersionStageModelVersion.version,
          'Production',
          true
        );
      expect(transitionedModelVersion.current_stage).toBe('Production');
    });

    test('Should throw if no parameters are passed to the method', async () => {
      await expect(
        // @ts-expect-error: Trying to use 0 parameters when parameters are required
        modelVersionClient.transitionModelVersionStage()
      ).rejects.toThrow();
    });
  });

  describe('setModelVersionTag', () => {
    test('Should set a tag on a specific model version.', async () => {
      const setModelVersionTagModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );

      await modelVersionClient.setModelVersionTag(
        modelName,
        setModelVersionTagModelVersion.version,
        'setModelmodelVersionKey',
        'setModelVersionValue'
      );

      const newModelVersionTagObject: keyable =
        await modelVersionClient.getModelVersion(
          modelName,
          setModelVersionTagModelVersion.version
        );

      let tagExists = false;
      for (let i = 0; i < newModelVersionTagObject.tags.length; i++) {
        if (
          newModelVersionTagObject.tags[i].key === 'setModelmodelVersionKey' &&
          newModelVersionTagObject.tags[i].value === 'setModelVersionValue'
        ) {
          tagExists = true;
        }
      }
      expect(tagExists).toBe(true);
    });

    test('Should throw if no parameters are passed to the method', async () => {
      // @ts-expect-error: Trying to use 0 parameters when parameters are required
      await expect(modelVersionClient.setModelVersionTag()).rejects.toThrow();
    });
  });

  describe('deleteModelVersionTag', () => {
    test('Should delete a tag from a specific model version.', async () => {
      const deleteModelVersionTagModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      await modelVersionClient.deleteModelVersionTag(
        modelName,
        deleteModelVersionTagModelVersion.version,
        'test-tag'
      );
      const deleteModelVersionTagObject: keyable =
        await modelVersionClient.getModelVersion(
          modelName,
          deleteModelVersionTagModelVersion.version
        );
      let tagExists = false;
      for (let i = 0; i < deleteModelVersionTagObject.tags.length; i++) {
        if (deleteModelVersionTagObject.tags[i].key === 'test-tag') {
          tagExists = true;
        }
      }
      expect(tagExists).toBe(false);
    });

    test('Should throw if no parameters are passed to the method', async () => {
      await expect(
        // @ts-expect-error: Trying to use 0 parameters when parameters are required
        modelVersionClient.deleteModelVersionTag()
      ).rejects.toThrow();
    });
  });

  describe('deleteModelVersion', () => {
    test('Should delete the specified model version', async () => {
      const deleteModelVersionModelVersion: keyable =
        await modelVersionClient.createModelVersion(
          modelName,
          run.info.artifact_uri,
          run.info.run_id,
          [
            { key: 'test-tag', value: 'test-value' },
            { key: 'test-tag2', value: 'test-value2' },
          ],
          modelVersionRunLink,
          modelVersionDescription
        );
      await modelVersionClient.deleteModelVersion(
        modelName,
        deleteModelVersionModelVersion.version
      );

      await expect(
        modelVersionClient.getModelVersion(
          modelName,
          deleteModelVersionModelVersion.version
        )
      ).rejects.toThrow();
    });

    test('Should throw if no parameters are passed to the method', async () => {
      await expect(
        // @ts-expect-error: Trying to use 0 parameters when parameters are required
        modelVersionClient.deleteModelVersion()
      ).rejects.toThrow();
    });
  });

  afterAll(async () => {
    await modelRegistryClient.deleteRegisteredModel(modelName);
    await runClient.deleteRun(run.info.run_id);
  });
});
