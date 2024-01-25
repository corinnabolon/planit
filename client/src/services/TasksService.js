import { AppState } from "../AppState.js";
import { Task } from "../models/Task.js"
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";

class TasksService {

  async createTask(taskData) {
    const res = await api.post("api/tasks", taskData)
    AppState.tasks.push(new Task(res.data))
  }

  async changeStatus(taskId) {
    logger.log("Test")
    const taskData = AppState.tasks.find(task => taskId == task.id)
    if (!taskData) {
      return
    }
    logger.log(taskData)
    taskData.isComplete = !taskData.isComplete
    logger.log(taskData)
    const res = await api.put(`api/tasks/${taskData.id}`, taskData)
    const updatedTask = new Task(res.data)
    logger.log(updatedTask)
    const taskIndex = AppState.tasks.findIndex(task => updatedTask.id == task.id)
    AppState.tasks.splice(taskIndex, 1, updatedTask)
  }

  async editTask(taskData) { 
    logger.log("taskData", taskData)
    const res = await api.put(`api/tasks/${taskData.id}`, taskData)
    const updatedTask = new Task(res.data)
    AppState.activeTask = updatedTask
    let updatedTaskIndex = AppState.tasks.findIndex(task => task.id == taskData.id)
    AppState.tasks.splice(updatedTaskIndex, 1, updatedTask)  
  }

  async removeTask(taskId) {
    const res = await api.delete(`api/tasks/${taskId}`)
    let taskIndex = AppState.tasks.findIndex(task => task.id == taskId)
    AppState.tasks.splice(taskIndex, 1)
  }

  setActiveTask(taskId) {
    let foundTask = AppState.tasks.find(task => task.id == taskId)
    AppState.activeTask = foundTask
  }

}

export const tasksService = new TasksService()