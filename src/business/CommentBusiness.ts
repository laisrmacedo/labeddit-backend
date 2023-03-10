import { CommentDatabase, CommentDB } from "../database/CommentDatabase";
import { PostDatabase, PostDB } from "../database/PostDatabase";
import { CreateCommenteOutputDTO, GetCommentsOutputDTO } from "../dtos/CommentDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
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
    private postDatabase: PostDatabase,
    private tokenManager: TokenManager,
    private idGenerator: IdGenerator
  ){}

  public getComments = async (input: GetCommentsOutputDTO): Promise<CommentBusinessModel[]> => {
    const { token } = input

    //permission check
    const payload = this.tokenManager.getPayload(token)
    if (payload === null) {
      throw new BadRequestError("ERROR: Login failed.")
    }

    const commentsDB: CommentDB[] = await this.commentDatabase.getComments()
    const comments = commentsDB.map((commentDB) => {
      const comment = new Comment(
        commentDB.id,
        commentDB.creator_id,
        commentDB.post_id,
        commentDB.content,
        commentDB.upvote,
        commentDB.downvote,
        commentDB.created_at,
        commentDB.updated_at
      )
      return comment.toBusinessModel()
    })

    return comments
  }

  public createComment = async (input: CreateCommenteOutputDTO): Promise<void> => {
    const {postIdToComment, token, content} = input

    const postDB: PostDB | undefined = await this.postDatabase.getPostById(postIdToComment)
    if(!postDB){
      throw new NotFoundError("ERROR: 'postIdToComment' not found")
    }

    //login ckeck
    const payload = this.tokenManager.getPayload(token)
    if(payload === null){
      throw new BadRequestError("ERROR: Login failed")
    }

    //characters quantity
    if(content.length > 300){
      throw new BadRequestError("ERROR: The maximum post length is 300 characters.")
    }

    const newComment = new Comment(
      this.idGenerator.generate(), 
      payload.id,
      postDB.id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString()
    )

    await this.commentDatabase.insertComment(newComment.toDBModel())
  }
}