import userModel from "./user.model";
import { H3Event } from "h3";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig();
const JWT_SECRET = config.public.jwt;
const JWT_EXPIRES_IN = "1h";

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
            if (err instanceof jwt.TokenExpiredError) {
                // Если токен истёк, всё равно парсим его
                decodedToken = jwt.decode(token) as { userId: string };
                if (!decodedToken || !decodedToken.userId) {
                    throw new Error("Invalid token data");
                }
            } else {
                throw new Error("Invalid or expired token");

                return {
                    success: false,
                    message: "Invalid or expired token"
                }
            }
        }

        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Получаем список всех пользователей и сортируем по _id, чтобы вычислить порядковый номер
        const allUsers = await userModel.find().sort({ _id: 1 });
        const userIndex = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;

        // Генерируем новый токен, если старый был просрочен
        const newToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return {
            success: true,
            user: {
                id: userIndex,  // Возвращаем порядковый номер пользователя
                username: user.username,
                email: user.email
            },
            token: newToken
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred"
        };
    }
});
