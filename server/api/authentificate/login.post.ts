import userModel from "./user.model";
import { H3Event } from "h3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

const JWT_SECRET = config.public.jwt;

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody<{ email: string; password: string }>(event);

        if (!body) {
            throw new Error("Invalid request body");
        }

        const { email, password } = body;

        if (!email || !password) {
            throw new Error("Missing required fields: email or password");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            success: true,
            message: "Authentication successful",
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