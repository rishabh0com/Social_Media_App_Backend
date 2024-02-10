const express = require("express");
const postRoutes = express.Router();

const postController = require("../controllers/post.controller.js");
const { authUser } = require("../middlewares/auth.middleware copy.js");

postRoutes.use(authUser)

postRoutes.post("/add", postController.createPost);

postRoutes.get("/", postController.getAllPosts);

postRoutes.put("/update/:id", postController.updatePost);

postRoutes.delete("/delete/:id", postController.deletePost);

module.exports = postRoutes;