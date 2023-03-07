import { BaseDatabase } from "./BaseDatabase";

export interface PostDB {
  id: string, 
  creator_id: string,
  content: string, 
  upvote: number,
  downvote: number,
  comments: number,
  created_at: string,
  updated_at: string
}

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"

  public async getPosts(q: string | undefined): Promise<PostDB[]> {
      let postsDB
      if (q) {
          const result = await BaseDatabase
              .connection(PostDatabase.TABLE_POSTS)
              .where("content", "LIKE", `%${q}%`)
          postsDB = result
      } else {
          const result = await BaseDatabase
              .connection(PostDatabase.TABLE_POSTS)
          postsDB = result
      }
      return postsDB
  }
}