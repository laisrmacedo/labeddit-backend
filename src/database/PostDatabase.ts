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

export class PostDatabase extends BaseDatabase {}