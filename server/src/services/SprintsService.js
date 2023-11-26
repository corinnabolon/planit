import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"


class SprintsService {

  async createSprint(sprintData) {
    let sprint = await dbContext.Sprints.create(sprintData)
    await sprint.populate("creator", "name picture")
    await sprint.populate("project")
    return sprint
  }

  async getSprintsByProjectId(projectId) {
    let sprints = await dbContext.Sprints.find({ projectId }).populate("project")
    return sprints
  }

  async removeSprint(sprintId, userId) {
    let sprint = await dbContext.Sprints.findById(sprintId)
    if (!sprint) {
      throw new BadRequest(`No sprint with the ID ${sprintId}`)
    }
    if (sprint.creatorId.toString() != userId) {
      throw new Forbidden("Not your sprint to delete")
    }
    sprint.remove()
    return `${sprintId} deleted`
  }

}

export const sprintsService = new SprintsService()