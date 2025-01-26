import userModel from "./user.model";
import { H3Event } from "h3";
import { IUser } from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig()

const JWT_SECRET = config.public.jwt;

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody<IUser>(event);

        if (!body) {
            throw new Error("Invalid request body");
        }

        const { username, email, password } = body;

        if (!username || !email || !password) {
            throw new Error("Missing required fields: username, email, or password");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new Error("Email is already in use");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            success: true,
            message: "User created successfully",
            token
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred"
        };
    }
});