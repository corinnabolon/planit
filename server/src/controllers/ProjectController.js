import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { projectsService } from "../services/ProjectsService.js";

export class ProjectController extends BaseController {

  constructor() {
    super('api/projects')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createProject)
      .get('', this.getAllMyProjects)
  }

  async createProject(req, res, next) {
    try {
      const projectData = req.body
      const userId = req.userInfo.id
      projectData.creatorId = userId
      const project = await projectsService.createProject(projectData)
      return res.send(project)
    } catch (error) {
      next(error)
    }
  }

  async getAllMyProjects(req, res, next) {
    try {
      const userId = req.userInfo.id
      const projects = await projectsService.getAllMyProjects(userId)
      return res.send(projects)
    } catch (error) {
      next(error)
    }
  }

}