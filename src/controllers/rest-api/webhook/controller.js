/*
  REST API Controller library for the /webhook route
*/

const { wlogger } = require('../../../adapters/wlogger')

// let _this

class WebhookRESTControllerLib {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /webhook REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /webhook REST Controller.'
      )
    }

    // Encapsulate dependencies
    // this.UserModel = this.adapters.localdb.Users
    // this.userUseCases = this.useCases.user

    // _this = this
  }

  /**
   * @api {post} /webhook New
   * @apiPermission public
   * @apiName Webhook New
   * @apiGroup Webhook
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "url": "https://test.com/my-webhook", "appId": "test" }' localhost:5001/webhook/
   *
   * @apiDescription
   * Add a new webhook. When a new database entry is added that matches the appID,
   * a webhook will call the given URL.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async postWebhook (ctx) {
    try {
      const url = ctx.request.body.url
      const appId = ctx.request.body.appId

      const inputData = { url, appId }
      // console.log(`inputData: ${JSON.stringify(inputData, null, 2)}`)

      // Returns the MongoDB ID of the new entry.
      const id = await this.useCases.webhook.addWebhook.addNewWebhook(inputData)

      ctx.body = {
        success: true,
        id
      }
    } catch (err) {
      console.log('Error in post-webhook.js/restController()')
      throw err
    }
  }

  /**
   * @api {delete} /webhook Delete
   * @apiPermission public
   * @apiName Webhook Delete
   * @apiGroup Webhook
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE -d '{ "url": "https://test.com/my-webhook", "appId": "test" }' localhost:5001/webhook/
   *
   * @apiDescription
   * Delete and existing webhook.
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async deleteWebhook (ctx) {
    try {
      const url = ctx.request.body.url
      const appId = ctx.request.body.appId

      const inputData = { url, appId }
      // console.log(`inputData: ${JSON.stringify(inputData, null, 2)}`)

      // Returns true or false depending on the state of success.
      const success = await this.useCases.webhook.remove(inputData)

      ctx.body = {
        success
      }
    } catch (err) {
      wlogger.error(err)
      console.log('Error in delete-webhook.js/restController()')
      throw err
    }
  }
}

module.exports = WebhookRESTControllerLib
