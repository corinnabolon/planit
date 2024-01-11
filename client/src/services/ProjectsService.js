import { AppState } from "../AppState.js";
import { Project } from "../models/Project.js";
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";

class ProjectsService {

  async getProjects() {
    const res = await api.get("api/projects")
    logger.log(res.data)
    AppState.projects = res.data.map(projectPojo => new Project(projectPojo))
  }

  async getProjectById(projectId) {
    const res = await api.get(`api/projects/${projectId}`)
    AppState.project = new Project(res.data)
  }

}

export const projectsService = new ProjectsService()