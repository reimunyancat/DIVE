import { Request, Response } from 'express'
import { CommunityService } from '../services/communityService'

export class CommunityController {
  static async getPosts(req: Request, res: Response) {
    try {
      const { search, region, limit = '20', offset = '0' } = req.query
      
      const posts = await CommunityService.getPosts({
        search: search as string,
        region: region as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      })
      
      res.json({ success: true, data: posts })
    } catch (error) {
      console.error('Get posts error:', error)
      res.status(500).json({ success: false, error: 'Failed to get posts' })
    }
  }

  static async getPost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const post = await CommunityService.getPost(id)
      
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' })
      }
      
      res.json({ success: true, data: post })
    } catch (error) {
      console.error('Get post error:', error)
      res.status(500).json({ success: false, error: 'Failed to get post' })
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const { userId, itineraryId, title, description, thumbnailUrl, region, tags } = req.body
      
      if (!userId || !title) {
        return res.status(400).json({ success: false, error: 'userId and title are required' })
      }
      
      const post = await CommunityService.createPost({
        userId,
        itineraryId,
        title,
        description,
        thumbnailUrl,
        region,
        tags,
      })
      
      res.json({ success: true, data: post })
    } catch (error) {
      console.error('Create post error:', error)
      res.status(500).json({ success: false, error: 'Failed to create post' })
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, description, thumbnailUrl, region, tags, isActive } = req.body
      
      const post = await CommunityService.updatePost(id, {
        title,
        description,
        thumbnailUrl,
        region,
        tags,
        isActive,
      })
      
      res.json({ success: true, data: post })
    } catch (error) {
      console.error('Update post error:', error)
      res.status(500).json({ success: false, error: 'Failed to update post' })
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params
      await CommunityService.deletePost(id)
      res.json({ success: true, message: 'Post deleted' })
    } catch (error) {
      console.error('Delete post error:', error)
      res.status(500).json({ success: false, error: 'Failed to delete post' })
    }
  }

  static async toggleLike(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { userId } = req.body
      
      if (!userId) {
        return res.status(400).json({ success: false, error: 'userId is required' })
      }
      
      const result = await CommunityService.toggleLike(id, userId)
      res.json({ success: true, data: result })
    } catch (error) {
      console.error('Toggle like error:', error)
      res.status(500).json({ success: false, error: 'Failed to toggle like' })
    }
  }

  static async getUserPosts(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const posts = await CommunityService.getUserPosts(userId)
      res.json({ success: true, data: posts })
    } catch (error) {
      console.error('Get user posts error:', error)
      res.status(500).json({ success: false, error: 'Failed to get user posts' })
    }
  }
}
