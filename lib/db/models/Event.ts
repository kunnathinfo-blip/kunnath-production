import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Traditional', 'Corporate', 'Upcoming'], 
    required: true 
  },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  isFlexibleDate: { type: Boolean, default: false },
  images: [{ type: String }],
  capacity: { type: Number },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

eventSchema.index({ category: 1, date: -1 });
eventSchema.index({ isActive: 1 });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
export type IEvent = mongoose.InferSchemaType<typeof eventSchema> & { _id: mongoose.Types.ObjectId };
