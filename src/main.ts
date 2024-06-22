import * as core from '@actions/core'
import { ElasticBeanstalk } from 'aws-sdk'
import { assert } from 'console'

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

    const eb = new ElasticBeanstalk({
      accessKeyId: aws_access_key,
      secretAccessKey: aws_secret_key,
      region: aws_region
    })

    const params = {
      ApplicationName: application_name,
      EnvironmentName: environment_name,
      VersionLabel: version_label
    }

    eb.updateEnvironment(params, function (err, data) {
      if (err) {
        console.log(err, err.stack)
        core.setFailed(err.message)
      } else {
        console.log(data)
      }
    })

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
