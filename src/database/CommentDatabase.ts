import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase, PostDB } from "./PostDatabase";

export interface CommentDB {
  id: string, 
  creator_id: string,
  post_id: string,
  content: string, 
  upvote: number,
  downvote: number,
  created_at: string,
  updated_at: string
}

export class CommentDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_COMMENTS = "comments"

  public async getPostById(id: string): Promise<PostDB | undefined> {
    const result = await BaseDatabase
    .connection(PostDatabase.TABLE_POSTS)
    .where({ id })
    
    return result[0]
  }

  public async getComments(): Promise<CommentDB[]>{
    const result = await BaseDatabase
    .connection(CommentDatabase.TABLE_COMMENTS)
    .select()
    
    return result
  }

  public async insertComment(comment: CommentDB): Promise<void> {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .insert(comment)
  }
}