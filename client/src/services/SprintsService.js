import { AppState } from "../AppState.js"
import { Sprint } from "../models/Sprint.js"
import { api } from "./AxiosService.js";


class SprintsService {

  setActiveSprint(sprintId) {
    AppState.activeSprint =  AppState.sprints.find(sprint => sprint.id == sprintId)
  }

  async createSprint(sprintData) {
    const res = await api.post(`api/sprints`, sprintData)
    AppState.sprints.push(new Sprint(res.data))
  }

}

export const sprintsService = new SprintsService()