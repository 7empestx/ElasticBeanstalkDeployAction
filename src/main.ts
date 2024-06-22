import * as core from '@actions/core'
import { wait } from './wait'
import { ElasticBeanstalk } from 'aws-sdk'

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
    const platform: string = core.getInput('platform')

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

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
