import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, slug: 'title', unique: true },
  body: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  publishDate: { type: Date, default: Date.now },
  isDraft: { type: Boolean, default: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  featured: { type: Boolean, default: false }, 
  versions: [
    {
      title: String,
      body: String,
      updatedAt: Date,
    },
  ],
}, { 
  timestamps: true 
});

ContentSchema.pre('findOneAndUpdate', async function(next) {
  this.options.new = true;
  this.options.runValidators = true;

  const update = this.getUpdate();
  if (update.$set && update.$set.body) {
    try {
      const doc = await this.model.findOne(this.getQuery());
      if (doc) {
        doc.versions.push({
          title: doc.title,
          body: doc.body,
          updatedAt: doc.updatedAt,
        });
        
        if (doc.versions.length > 20) {
          doc.versions.shift();
        }
        await doc.save();
      }
    } catch (error) {
      console.error("Error in pre-findOneAndUpdate hook:", error);
    }
  }
  next();
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);