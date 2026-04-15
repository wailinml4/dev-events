import mongoose, { Schema, Document, Model } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking document interface for TypeScript type safety.
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validate email format using regex.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to verify that the referenced event exists.
 * This prevents orphaned bookings without corresponding events.
 */
bookingSchema.pre<IBooking>('save', async function () {
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});

// Create index on eventId for optimized queries
bookingSchema.index({ eventId: 1 });

/**
 * Booking model: Represents a user booking for an event.
 */
if (process.env.NODE_ENV !== 'production' && mongoose.models.Booking) {
  mongoose.deleteModel('Booking');
}

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', bookingSchema);

export { Booking };
