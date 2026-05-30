import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    sender: {
      type: String,
      enum: ["user", "agent"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

 const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
