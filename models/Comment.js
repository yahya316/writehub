// models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);