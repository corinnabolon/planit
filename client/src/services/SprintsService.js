import { AppState } from "../AppState.js"
import { Sprint } from "../models/Sprint.js"
import { api } from "./AxiosService.js";
import { logger } from "../utils/Logger.js";


class SprintsService {

  setActiveSprint(sprintId) {
    logger.log(AppState.sprints)
    AppState.activeSprint = AppState.sprints.find(sprint => sprint.id == sprintId)
  }

  async createSprint(sprintData) {
    const res = await api.post(`api/sprints`, sprintData)
    AppState.sprints.push(new Sprint(res.data))
  }

  async removeSprint(sprintId) {
    const res = await api.delete(`api/sprints/${sprintId}`)
    AppState.activeSprint = null
    let sprintIndex = AppState.sprints.findIndex(sprint => sprint.id == sprintId)
    AppState.sprints.splice(sprintIndex, 1)
  }

}

export const sprintsService = new SprintsService()