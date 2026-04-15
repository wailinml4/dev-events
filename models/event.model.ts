import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Event document interface for TypeScript type safety.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generate URL-friendly slug from title.
 * Replaces spaces with hyphens and converts to lowercase.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Validate and normalize date to ISO format (YYYY-MM-DD).
 */
function normalizeDateToISO(dateString: string): string {
  const parsed = new Date(dateString);

  if (isNaN(parsed.getTime())) {
    throw new Error('Invalid date format. Use ISO 8601 (YYYY-MM-DD) or a parsable date string.');
  }

  return parsed.toISOString().split('T')[0];
}

/**
 * Validate and normalize time to 24-hour format (HH:MM).
 */
function normalizeTime(timeString: string): string {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(timeString)) {
    throw new Error('Invalid time format. Use HH:MM (24-hour format).');
  }

  return timeString;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true, // Allow null/undefined for unique index
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Event image URL is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be one of: online, offline, hybrid',
      },
      required: [true, 'Event mode is required'],
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to:
 * 1. Generate slug from title (only if title is new or changed)
 * 2. Normalize date to ISO format
 * 3. Normalize time to 24-hour format
 */
eventSchema.pre<IEvent>('save', function () {
  // Generate slug only if title is new or modified
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  this.date = normalizeDateToISO(this.date);

  this.time = normalizeTime(this.time);
});

// Create index on slug for optimized queries
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model: Represents a developer conference, hackathon, or meetup.
 */
if (process.env.NODE_ENV !== 'production' && mongoose.models.Event) {
  mongoose.deleteModel('Event');
}

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', eventSchema);

export { Event };
