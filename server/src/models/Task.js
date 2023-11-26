import { Schema } from "mongoose";

export const TaskSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 50 },
    weight: { type: Number, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    isComplete: { type: Boolean, required: true, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

TaskSchema.virtual("project", {
  localField: "projectId",
  foreignField: "_id",
  ref: "Project",
  justOne: true
})

TaskSchema.virtual("sprint", {
  localField: "sprintId",
  foreignField: "_id",
  ref: "Sprint",
  justOne: true
})

TaskSchema.virtual("creator", {
  localField: "creatorId",
  foreignField: "_id",
  ref: "Account",
  justOne: true
})