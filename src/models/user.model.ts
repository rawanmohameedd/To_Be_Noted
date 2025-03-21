import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         role:
 *           type: string
 *           enum: [admin, manager, user]
 *           default: user
 *           description: The role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "user";
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);