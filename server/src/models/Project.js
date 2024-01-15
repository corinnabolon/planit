import { Schema } from "mongoose";

export const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 50 },
    description: { type: String, required: true, maxLength: 1000 },
    isLastEdited: { type: Boolean, required: true, default: false },
    creatorId: {
      type: Schema.Types.ObjectId, ref: "Account", required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

ProjectSchema.virtual("creator", {
  localField: "creatorId",
  foreignField: "_id",
  ref: "Account",
  justOne: true
})