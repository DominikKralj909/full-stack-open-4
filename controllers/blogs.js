const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

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

router.delete('/:id', async (request, response) => {
	const { id } = request.params;

	try {
		const blogToDelete = await Blog.findById(id);

		if (!blogToDelete) {
			return response.status(404).json({ error: 'Blog not found' });
		}

		await Blog.findByIdAndDelete(id);
		response.status(204).end();

	} catch (error) {
		response.status(400).json({ error: 'Invalid ID format' });
	}
});

router.put('/:id', async (request, response) => {
	const { id } = request.params;
	const { likes } = request.body;


	try {
		const blogToUpdate = await Blog.findById(id);

		if (!blogToUpdate) {
			return response.status(404).json({ error: 'Blog not found' });
		}

		if (likes !== undefined) {
			blogToUpdate.likes = likes;
		}

		const updatedBlog = await blogToUpdate.save();

		response.json(updatedBlog);

	} catch (error) {
		response.status(500).json({ error: 'Something went wrong' });
	}
});


module.exports = router
