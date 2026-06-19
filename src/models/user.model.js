import mongoose from "mongoose";


/**
 * User Schema
 *
 * Stores authentication information for Cortexio users.
 * Passwords are securely hashed before persistence.
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;