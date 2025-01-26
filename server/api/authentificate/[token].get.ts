import userModel from "./user.model";
import { H3Event } from "h3";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();
const JWT_SECRET = config.public.jwt;

export default defineEventHandler(async (event: H3Event) => {
    try {
        const token = event.context.params?.token;

        if (!token) {
            throw new Error("Token is required");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
        } catch (err) {
            throw new Error("Invalid or expired token");
        }

        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            throw new Error("User not found");
        }

        return {
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
            token: event.context.params?.token
        };
    }
});
