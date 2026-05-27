import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread',
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
export type IContactMessage = mongoose.InferSchemaType<typeof contactMessageSchema> & { _id: mongoose.Types.ObjectId };
