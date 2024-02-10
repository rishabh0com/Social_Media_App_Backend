const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("./config/database");
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js");

require("dotenv").config();

const app = express();


// middleware
app.use(express.json());
app.use(cors({
  origin: ["*", "http://localhost:5173","http://127.0.0.1:5173","http://192.168.92.144:5173/"],
  credentials: true,
}));

app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Method : ${req.method}`, "Path:", req.url, "Body:", req.body, "cookies:", {...req.cookies});
  next();
})


// Routes
app.use("/users", userRoutes);
app.use("/posts",postRoutes)

// listening the server
app.listen(process.env.PORT, async () => {
  try {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
    await connection; // connection to DB
    console.log(`DB is connected ~`);
  } catch (error) {
    console.log("Error", error);
  }
});
