import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"


class TasksService {

  async createTask(taskData) {
    let task = await dbContext.Tasks.create(taskData)
    await task.populate("creator", "name picture")
    await task.populate("project")
    await task.populate("sprint")
    return task
  }

  async getTasksByProjectId(projectId) {
    let tasks = await dbContext.Tasks.find({ projectId }).populate("creator", "name picture").populate("project").populate("sprint")
    return tasks
  }

  async editTask(taskData, taskId, userId) {
    let task = await dbContext.Tasks.findById(taskId)
    if (!task) {
      throw new BadRequest(`${taskId} is not a valid task ID`)
    }
    if (task.creatorId.toString() != userId) {
      throw new Forbidden("Not your task to edit")
    }
    task.name = taskData.name || task.name
    task.weight = taskData.weight || task.weight
    task.sprintId = taskData.sprintId || task.sprintId
    task.isComplete = taskData.isComplete != undefined ? taskData.isComplete : task.isComplete
    await task.save()
    return task
  }

  async removeTask(taskId, userId) {
    let task = await dbContext.Tasks.findById(taskId)
    if (!task) {
      throw new BadRequest(`No task with ID ${taskId}`)
    }
    if (task.creatorId.toString() != userId) {
      throw new Forbidden("Not your task to delete")
    }
    await task.remove()
    return "Task deleted"
  }

}

export const tasksService = new TasksService()