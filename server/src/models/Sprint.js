import { Schema } from "mongoose";

export const SprintSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 50 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

SprintSchema.virtual("creator", {
  localField: "creatorId",
  foreignField: "_id",
  ref: "Account",
  justOne: true
})

SprintSchema.virtual("project", {
  localField: "projectId",
  foreignField: "_id",
  ref: "Project",
  justOne: true
})