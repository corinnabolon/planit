import { AppState } from "../AppState.js";
import { Project } from "../models/Project.js";
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";
import { Sprint } from "../models/Sprint.js";
import { Task } from "../models/Task.js"

class ProjectsService {

  async getProjects() {
    const res = await api.get("api/projects")
    AppState.projects = res.data.map(projectPojo => new Project(projectPojo))
  }

  async getProjectById(projectId) {
    if (AppState.project) {
      this.setLastEditedFalse(AppState.project)
    }
    const res = await api.get(`api/projects/${projectId}`)
    const project = new Project(res.data)
    AppState.project = project
    this.setProjectAsLastEdited(project)
  }

  async setProjectAsLastEdited(projectData) {
    projectData.isLastEdited = true
    const res = await api.put(`api/projects/${projectData.id}`, projectData)
    const lastEditedProject = new Project(res.data)
    AppState.lastEditedProject = lastEditedProject
    logger.log("AppState new lastEditedProject", AppState.lastEditedProject)
  }

  async setLastEditedFalse(projectData) {
    projectData.isLastEdited = false
    const res = await api.put(`api/projects/${projectData.id}`, projectData)
    logger.log("This is the edited info after setting the old one false", res.data)
  }

  async getLastProject() {
    await this.getProjects()
    const foundProject = AppState.projects.find(project => project.isLastEdited == true)
    AppState.lastEditedProject = foundProject
  }

  async getSprintsByProjectId(projectId) {
    const res = await api.get(`api/projects/${projectId}/sprints/`)
    AppState.sprints = res.data.map(sprintPojo => new Sprint(sprintPojo))
  }

  async getTasksByProjectId(projectId) {
    const res = await api.get(`api/projects/${projectId}/tasks/`)
    AppState.tasks = res.data.map(taskPojo => new Task(taskPojo))
  }

  async removeProject(projectId) {
    const res = await api.delete(`api/projects/${projectId}`)
    const foundProject = AppState.projects.find(project => projectId == project.id)
    if (foundProject == -1) {
      throw new Error(`No project with ID: ${projectId}`)
    }
    AppState.projects.splice(foundProject, 1)
    logger.log("Projects array after splicing", AppState.projects)
  }
  
  clearDataForProjectPage() {
    AppState.project = null
    AppState.sprints = []
  }

  clearAllProjects() {
    AppState.projects = []
  }

}

export const projectsService = new ProjectsService()