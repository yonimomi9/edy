const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nameForDisplay: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '/default_profile_pic.png', // Path to the default image
  },
  roles: {
    user: {
      type: Number,
      default: 2001,
    },
    admin: {
      type: Number,
    },
  },
  watchedMovies: [
    {
      type: Number,
      default: [],
    },
  ],
});

userSchema.pre('save', async function (next) {
  // Only assign id if the document is new and id is not already set
  if (!this.isNew || this.id) return next();

  try {
    // Fetch the last user by id in descending order
    const lastUser = await this.constructor.findOne().sort({ id: -1 });

    // Assign the next id
    this.id = lastUser && lastUser.id ? lastUser.id + 1 : 1;
    next();
  } catch (err) {
    console.error('Error in pre-save hook:', err);
    next(err);
  }
});


userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);