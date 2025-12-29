import { Router } from 'express'
import { CommunityController } from '../controllers/communityController'

const router = Router()

// Get all posts
router.get('/posts', CommunityController.getPosts)

// Get single post
router.get('/posts/:id', CommunityController.getPost)

// Create post
router.post('/posts', CommunityController.createPost)

// Update post
router.put('/posts/:id', CommunityController.updatePost)

// Delete post
router.delete('/posts/:id', CommunityController.deletePost)

// Toggle like
router.post('/posts/:id/like', CommunityController.toggleLike)

// Get user's posts
router.get('/users/:userId/posts', CommunityController.getUserPosts)

export default router
