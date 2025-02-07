const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Movie schema
const MovieSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    sparse: true,
  },
  title: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: String, // Store category names as strings
      required: true,
    },
  ],
  filePath: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: true,
  },
});

// Pre-save hook to auto-increment `id`
MovieSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const lastMovie = await mongoose.model('Movie').findOne().sort({ id: -1 });
  this.id = lastMovie ? lastMovie.id + 1 : 1; // Start at 1 if no movies exist
  next();
});

// Exclude `_id` and include `id` in JSON output
MovieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id; // Exclude the default `_id`
    return ret;     // Return the transformed object
  },
});

module.exports = mongoose.model('Movie', MovieSchema);
