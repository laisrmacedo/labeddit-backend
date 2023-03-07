import { PostDatabase, PostDB } from "../database/PostDatabase";
import { GetPostsOutputDTO } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export interface PostBusinessModel {
  id: string, 
  creatorId: string,
  content: string, 
  upvote: number,
  downvote: number,
  comments: number,
  createdAt: string,
  updatedAt: string
}

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private tokenManager: TokenManager,
    private idGenerator: IdGenerator
  ){}

  public getPosts = async (input: GetPostsOutputDTO): Promise<PostBusinessModel[]> => {
    const { token, q } = input

    //permission check
    const payload = this.tokenManager.getPayload(token)
    if (payload === null) {
        throw new BadRequestError("ERROR: Login failed.")
    }

    const postsDB: PostDB[] = await this.postDatabase.getPosts(q)
    const posts = postsDB.map((postDB) => {
        const post = new Post(
          postDB.id,
          postDB.creator_id,
          postDB.content,
          postDB.upvote,
          postDB.downvote,
          postDB.comments,
          postDB.created_at,
          postDB.updated_at
        )
        return post.toBusinessModel()
    })

    return posts
}
}