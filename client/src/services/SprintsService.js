import { AppState } from "../AppState.js"


class SprintsService {

  setActiveSprint(sprintId) {
    AppState.activeSprint =  AppState.sprints.find(sprint => sprint.id == sprintId)
  }

}

export const sprintsService = new SprintsService()