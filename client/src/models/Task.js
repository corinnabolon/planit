export class Task {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.projectId = data.projectId
    this.sprintId = data.sprintId
    this.creatorId = data.creatorId
    this.isComplete = data.isComplete
  }
}