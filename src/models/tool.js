import { model, Schema } from 'mongoose';

const bookedRangeSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  { _id: false },
);

const toolSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      trim: true,
    },
    images: {
      type: String,
      // required: true,
      trim: true,
    },
    rating: {
      type: Number,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    rentalTerms: {
      type: String,
      required: true,
    },
    bookedDates: {
      type: [bookedRangeSchema],
      default: [],
    },
    feedbacks: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Feedback',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

toolSchema.index({ name: 'text', description: 'text' });

export const Tool = model('Tool', toolSchema);
