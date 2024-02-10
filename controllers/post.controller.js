const PostModel = require('../models/post.model.js');
const createPost = async (req, res) => {
    const { title, device, body,userId } = req.body;
    try {
        const post = await PostModel({
            title,
            device,
            userId,
            body,
        });
        await post.save();
        res.send({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
}

//get all posts
const getAllPosts = async (req, res) => {
    const { userId } = req.query;
    try {
        const posts = await PostModel.find(userId);
        console.log(posts)
        res.send({ message: "All posts", posts });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
}


const updatePost = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const post = await PostModel.findByIdAndUpdate(id,req.body);
        console.log(post)
        res.send({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
}


const deletePost = async (req, res) => {
    const  id = req.params.id;
    try {
        const post = await PostModel.findByIdAndDelete(id);
        res.send({ message: "Post deleted successfully", post });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
}

module.exports = { createPost, getAllPosts, updatePost, deletePost };