import * as core from '@actions/core'
import { assert } from 'console'
import { ElasticBeanstalkClient, UpdateEnvironmentCommand } from "@aws-sdk/client-elastic-beanstalk"; 

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const aws_access_key: string = core.getInput('aws_access_key')
    const aws_secret_key: string = core.getInput('aws_secret_key')
    const application_name: string = core.getInput('application_name')
    const environment_name: string = core.getInput('environment_name')
    const version_label: string = core.getInput('version_label')
    const aws_region: string = core.getInput('aws_region')
    //const platform: string = core.getInput('platform')

    assert(aws_access_key, 'aws_access_key is required')
    assert(aws_secret_key, 'aws_secret_key is required')
    assert(application_name, 'application_name is required')
    assert(environment_name, 'environment_name is required')
    assert(version_label, 'version_label is required')
    assert(aws_region, 'aws_region is required')

    // Set variables to local environment
    process.env.AWS_ACCESS_KEY_ID = aws_access_key
    process.env.AWS_SECRET_ACCESS_KEY = aws_secret_key
    process.env.AWS_REGION = aws_region
    process.env.APPLICATION_NAME = application_name
    process.env.ENVIRONMENT_NAME = environment_name
    process.env.VERSION_LABEL = version_label

    const config = {
      region: aws_region,
      credentials: {
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key
      }
    }
    // Create an ElasticBeanstalk client service object
    const client = new ElasticBeanstalkClient(config);
    assert(client, 'client is required')

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
