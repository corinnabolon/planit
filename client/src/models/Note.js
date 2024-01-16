export class Note {
  constructor(data) {
    this.id = data.id
    this.body = data.body
    this.taskId = data.taskId
    this.projectId = data.projectId
    this.creator = data.creator
  }
}