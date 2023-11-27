import { AppState } from "../AppState.js";
import { Project } from "../models/Project.js";
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";

class ProjectsService {

  async getProjects() {
    let res = await api.get("api/projects")
    logger.log(res.data)
    AppState.projects = res.data.map(projectPojo => new Project(projectPojo))
  }

}

export const projectsService = new ProjectsService()