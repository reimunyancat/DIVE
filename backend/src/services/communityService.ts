import { supabase } from '../config/supabase'

interface CreatePostInput {
  userId: string
  itineraryId?: string
  title: string
  description?: string
  thumbnailUrl?: string
  region?: string
  tags?: string[]
}

interface UpdatePostInput {
  title?: string
  description?: string
  thumbnailUrl?: string
  region?: string
  tags?: string[]
  isActive?: boolean
}

interface GetPostsOptions {
  search?: string
  region?: string
  limit: number
  offset: number
}

export class CommunityService {
  static async getPosts(options: GetPostsOptions) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        itineraries:itinerary_id (title, theme)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(options.offset, options.offset + options.limit - 1)

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options.region) {
      query = query.eq('region', options.region)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  static async getPost(id: string) {
    // Increment view count (ignore errors)
    try {
      await supabase
        .from('community_posts')
        .update({ views_count: supabase.rpc('increment_view') })
        .eq('id', id)
    } catch {}

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        itineraries:itinerary_id (
          *,
          itinerary_items (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createPost(input: CreatePostInput) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: input.userId,
        itinerary_id: input.itineraryId,
        title: input.title,
        description: input.description,
        thumbnail_url: input.thumbnailUrl,
        region: input.region,
        tags: input.tags || [],
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePost(id: string, input: UpdatePostInput) {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description
    if (input.thumbnailUrl !== undefined) updateData.thumbnail_url = input.thumbnailUrl
    if (input.region !== undefined) updateData.region = input.region
    if (input.tags !== undefined) updateData.tags = input.tags
    if (input.isActive !== undefined) updateData.is_active = input.isActive

    const { data, error } = await supabase
      .from('community_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deletePost(id: string) {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  static async toggleLike(postId: string, userId: string) {
    // Check if already liked
    const { data: existing } = await supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // Unlike
      await supabase
        .from('community_likes')
        .delete()
        .eq('id', existing.id)

      // Decrement likes count
      const { data: post } = await supabase
        .from('community_posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      if (post) {
        await supabase
          .from('community_posts')
          .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
          .eq('id', postId)
      }

      return { liked: false }
    } else {
      // Like
      await supabase
        .from('community_likes')
        .insert({ post_id: postId, user_id: userId })

      // Increment likes count
      const { data: post } = await supabase
        .from('community_posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      if (post) {
        await supabase
          .from('community_posts')
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq('id', postId)
      }

      return { liked: true }
    }
  }

  static async getUserPosts(userId: string) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        itineraries:itinerary_id (title, theme)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
