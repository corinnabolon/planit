import { Schema } from "mongoose";

export const NoteSchema = new Schema(
  {
    body: { type: String, required: true, maxLength: 1000 },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "Account", required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

NoteSchema.virtual("task", {
  localField: "taskId",
  foreignField: "_id",
  ref: "Task",
  justOne: true
})

NoteSchema.virtual("project", {
  localField: "projectId",
  foreignField: "_id",
  ref: "Project",
  justOne: true
})

NoteSchema.virtual("creator", {
  localField: "creatorId",
  foreignField: "_id",
  ref: "Account",
  justOne: true
})