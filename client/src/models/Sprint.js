export class Sprint {

  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.projectId = data.projectId
    this.creatorId = data.creatorId
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.createdAt)
    this.creator = data.creator
  }
}