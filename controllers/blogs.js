const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()

router.get('/', async (request, response) => {
	try {
		const blogs = await Blog.find({});
		response.json(blogs);
	} catch (error) {
		response.status(500).json({ error: 'Something went wrong' });
	}
});

router.post('/', async (request, response) => {
	const body = request.body;

	if (!body.title || !body.url) {
		return response.status(400).json({ error: 'Title and URL are required' });
	}
	
	if (!body.likes) body.likes = 0; 

	const blog = new Blog(body);
	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

module.exports = router
