import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
    default: '1 hr',
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Sport = mongoose.models.Sport || mongoose.model('Sport', sportSchema);
export default Sport;
export type ISport = mongoose.InferSchemaType<typeof sportSchema> & { _id: mongoose.Types.ObjectId };
