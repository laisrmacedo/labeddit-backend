import { BaseDatabase } from "./BaseDatabase";

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

export class CommentDatabase extends BaseDatabase {}