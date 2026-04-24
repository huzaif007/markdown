import mongoose from 'mongoose'

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB connected successfully ${conn.connection.host}`);
        return conn; // so that server can see the connection
    }
    catch (err) {
        console.error(err.message);
        process.exit(1); // exits the server if the db fails to connect
    }
}

export default connectDB;