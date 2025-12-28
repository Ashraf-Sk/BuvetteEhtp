import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  description: {
    fr: string;
    ar: string;
    en: string;
  };
  price: number;
  category: 'petit-dejeuner' | 'plats-chauds' | 'boissons';
  image: string;
  isAvailable: boolean;
  stock: number;
  preparationTime: number; // in minutes
  isPopular: boolean;
  averageRating: number;
  totalReviews: number;
  nutritionalInfo?: {
    calories?: number;
    allergens?: string[];
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      fr: {
        type: String,
        required: [true, 'Product name (FR) is required'],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, 'Product name (AR) is required'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'Product name (EN) is required'],
        trim: true,
      },
    },
    description: {
      fr: {
        type: String,
        required: [true, 'Product description (FR) is required'],
      },
      ar: {
        type: String,
        required: [true, 'Product description (AR) is required'],
      },
      en: {
        type: String,
        required: [true, 'Product description (EN) is required'],
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      enum: ['petit-dejeuner', 'plats-chauds', 'boissons'],
      required: [true, 'Category is required'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    nutritionalInfo: {
      calories: Number,
      allergens: [String],
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ isAvailable: 1 });
ProductSchema.index({ 'name.fr': 'text', 'name.ar': 'text', 'name.en': 'text' });

// Auto-update isAvailable based on stock
ProductSchema.pre('save', function (next) {
  if (this.stock === 0) {
    this.isAvailable = false;
  }
  next();
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

