import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true  
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model<IUser>('User', UserSchema);
export type { IUser };