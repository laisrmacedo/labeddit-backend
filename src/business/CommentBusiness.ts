import { CommentDatabase } from "../database/CommentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export interface CommentBusinessModel {
  id: string, 
  creatorId: string,
  postId: string,
  content: string, 
  upvote: number,
  downvote: number,
  createdAt: string,
  updatedAt: string
}

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private tokenManager: TokenManager,
    private idGenerator: IdGenerator
  ){}
}