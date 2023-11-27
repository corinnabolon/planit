import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { projectsService } from "../services/ProjectsService.js";
import { sprintsService } from "../services/SprintsService.js";
import { tasksService } from "../services/TasksService.js";
import { notesService } from "../services/NotesService.js";

export class ProjectsController extends BaseController {

  constructor() {
    super('api/projects')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAllMyProjects)
      .post('', this.createProject)
      .get('/:projectId', this.getProjectById)
      .get('/:projectId/sprints', this.getSprintsByProjectId)
      .get('/:projectId/tasks', this.getTasksByProjectId)
      .get('/:projectId/notes', this.getNotesByProjectId)
      .delete('/:projectId', this.removeProject)
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
      const query = req.query
      const projects = await projectsService.getAllMyProjects(query)
      return res.send(projects)
    } catch (error) {
      next(error)
    }
  }

  async getProjectById(req, res, next) {
    try {
      let projectId = req.params.projectId
      let project = await projectsService.getProjectById(projectId)
      return res.send(project)
    } catch (error) {
      next(error)
    }
  }

  async getSprintsByProjectId(req, res, next) {
    try {
      let projectId = req.params.projectId
      let sprints = await sprintsService.getSprintsByProjectId(projectId)
      return res.send(sprints)
    } catch (error) {
      next(error)
    }
  }

  async getTasksByProjectId(req, res, next) {
    try {
      let projectId = req.params.projectId
      let tasks = await tasksService.getTasksByProjectId(projectId)
      return res.send(tasks)
    } catch (error) {
      next(error)
    }
  }

  async getNotesByProjectId(req, res, next) {
    try {
      let projectId = req.params.projectId
      let notes = await notesService.getNotesByProjectId(projectId)
      return res.send(notes)
    } catch (error) {
      next(error)
    }
  }

  async removeProject(req, res, next) {
    try {
      let projectId = req.params.projectId
      let userId = req.userInfo.id
      let message = await projectsService.removeProject(projectId, userId)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }



}