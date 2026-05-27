import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  aadhaarNumber: {
    type: String,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isMember: {
    type: Boolean,
    default: false
  },
  membershipType: {
    type: String,
    enum: ['silver', 'gold', 'premium', 'none'],
    default: 'none'
  }
}, { timestamps: true });

userSchema.pre('save', async function (this: any) {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
export type IUser = mongoose.InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId; matchPassword: (enteredPassword: string) => Promise<boolean> };
