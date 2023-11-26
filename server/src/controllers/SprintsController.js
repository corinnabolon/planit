import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { sprintsService } from "../services/SprintsService.js";


export class SprintsController extends BaseController {

  constructor() {
    super('api/sprints')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post("", this.createSprint)
      .delete("/:sprintId", this.removeSprint)
  }


  async createSprint(req, res, next) {
    try {
      let userId = req.userInfo.id
      let sprintData = req.body
      sprintData.creatorId = userId
      let sprint = await sprintsService.createSprint(sprintData)
      return res.send(sprint)
    } catch (error) {
      next(error)
    }
  }

  async removeSprint(req, res, next) {
    try {
      let sprintId = req.params.sprintId
      let userId = req.userInfo.id
      let message = await sprintsService.removeSprint(sprintId, userId)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }



}