import { Schema } from "mongoose";

export const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    creatorId: {
      type: Schema.Types.ObjectId, ref: "Account", required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)