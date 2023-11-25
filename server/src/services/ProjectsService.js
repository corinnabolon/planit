import { dbContext } from "../db/DbContext.js"


class ProjectsService {

  async createProject(projectData) {
    const project = await dbContext.Projects.create(projectData)
    return project
  }

  async getAllMyProjects(creatorId) {
    const projects = await dbContext.Projects.find({ creatorId })
    return projects
  }


}

export const projectsService = new ProjectsService()