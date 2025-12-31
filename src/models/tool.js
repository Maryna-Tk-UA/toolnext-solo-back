import { model, Schema } from 'mongoose';

const toolSchema = new Schema(
  {
    owner: {
      //додати посилання на user
      type: String,
      required: true,
      trim: true,
    },
    category: {
      //додати посилання на category
      type: String,
      required: true,
      trim: true,
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
      //доробити під об'єкт
      type: String,
      trim: true,
    },
    rentalTerms: {
      type: String,
    },
    bookedDates: {
      // доробити
      type: [String],
    },
    feedbacks: {
      // доробити
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

export const Tool = model('Tool', toolSchema);
