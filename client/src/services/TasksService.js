import { AppState } from "../AppState.js";
import { Task } from "../models/Task.js"
import { api } from "./AxiosService.js";

class TasksService {

  async createTask(taskData) {
    const res = await api.post("api/tasks", taskData)
    AppState.tasks.push(new Task(res.data))
  }

}

export const tasksService = new TasksService()