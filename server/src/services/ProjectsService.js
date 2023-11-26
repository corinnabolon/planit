import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"


class ProjectsService {

  async createProject(projectData) {
    const project = await dbContext.Projects.create(projectData)
    await project.populate("creator", "name picture")
    return project
  }

  async getAllMyProjects(query) {
    const projects = await dbContext.Projects.find(query).populate("creator", "name picture")
    return projects
  }

  async getProjectById(projectId) {
    const project = await dbContext.Projects.findById(projectId).populate("creator", "name picture")
    if (!project) {
      throw new BadRequest(`No project with the ID ${projectId}`)
    }
    return project
  }

  async removeProject(projectId, userId) {
    let project = await dbContext.Projects.findById(projectId)
    if (!project) {
      throw new BadRequest(`No project with the ID ${projectId}`)
    }
    if (project.creatorId.toString() != userId) {
      throw new Forbidden(`Not your project to delete`)
    }
    await project.remove()
    return `${projectId} has been deleted`
  }


}

export const projectsService = new ProjectsService()