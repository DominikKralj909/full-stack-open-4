const express = require('express');
const blogsRouter = express.Router();

const Blog = require('../models/blog');
const User = require('../models/user');

const { tokenExtractor, userExtractor } = require('../middleware/auth');

blogsRouter.get('/', async (request, response) => {
	try {
		const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
		response.json(blogs);
	} catch (error) {
		response.status(500).json({ error: 'Something went wrong' });
	}
});

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
	const { title, author, url, likes } = request.body

	const user = await User.findOne();

	if (!user) {
		return response.status(400).json({ error: 'No users found' });
	}

	if (!title || !url) {
		return response.status(400).json({ error: 'Title and URL are required' });
	}

	const blog = new Blog({
		title,
		author,
		url,
		likes: likes || 0,
		user: user._id,
	});

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
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

blogsRouter.put('/:id', async (request, response) => {
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


module.exports = blogsRouter
