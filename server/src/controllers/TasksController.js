import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { tasksService } from "../services/TasksService.js";

export class TasksController extends BaseController {

  constructor() {
    super("api/tasks")
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post("", this.createTask)
      .put("/:taskId", this.editTask)
      .delete("/:taskId", this.removeTask)
  }

  async createTask(req, res, next) {
    try {
      let userId = req.userInfo.id
      let taskData = req.body
      taskData.creatorId = userId
      let task = await tasksService.createTask(taskData)
      return res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async editTask(req, res, next) {
    try {
      let taskData = req.body
      let taskId = req.params.taskId
      let userId = req.userInfo.id
      let task = await tasksService.editTask(taskData, taskId, userId)
      return res.send(task)
    } catch (error) {
      next(error)
    }
  }

  async removeTask(req, res, next) {
    try {
      let taskId = req.params.taskId
      let userId = req.userInfo.id
      let message = await tasksService.removeTask(taskId, userId)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }

}