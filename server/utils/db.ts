import mongoose from "mongoose";

const dbConnect = async (connection: string) => {
    try {
        await mongoose.connect(connection);
        console.log(`${connection} is connected`);
    } catch (error) {
        console.error(`Connection error: ${error}`);
    }
};

export default dbConnect;