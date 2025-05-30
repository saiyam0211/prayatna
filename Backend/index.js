const express = require("express");
const cookieParser = require("cookie-parser");
const { PORT } = require("./src/config");
const connectDB = require("./src/config/mongo.config");
const attachUser = require("./src/utils/attachUser");
const authRouter = require("./src/routes/auth_routes");
const cors = require("cors");



const app = express();



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachUser);
app.use(cors({
    origin: "http://localhost:5173", // Update this to your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    connectDB()
    console.log("Server is running on Port " + PORT);
});