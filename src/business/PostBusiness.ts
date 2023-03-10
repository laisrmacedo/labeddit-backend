import { PostDatabase, PostDB, postUpvoteDownvoteDB } from "../database/PostDatabase";
import { DeletePostOutputDTO, EditPostOutputDTO, CreatePostOutputDTO, GetPostsOutputDTO, UpvoteOrDownvotePostOutputDTO } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
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
  ) { }

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

  public createPost = async (input: CreatePostOutputDTO): Promise<void> => {
    const {token, content} = input

    //login ckeck
    const payload = this.tokenManager.getPayload(token)
    if(payload === null){
      throw new BadRequestError("ERROR: Login failed")
    }

    //characters quantity
    if(content.length > 300){
      throw new BadRequestError("ERROR: The maximum post length is 300 characters.")
    }

    const newPost = new Post(
      this.idGenerator.generate(), 
      payload.id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString()
    )

    await this.postDatabase.insertPost(newPost.toDBModel())
  }

  public editPost = async (input: EditPostOutputDTO): Promise<void> => {
    const {idToEdit, token, content} = input
    
    const postDB = await this.postDatabase.getPostById(idToEdit)
    if(!postDB){
      throw new NotFoundError("ERROR: 'idToEdit' not found.")
    }

    //login ckeck
    const payload = this.tokenManager.getPayload(token)
    if(payload === null){
      throw new BadRequestError("ERROR: Login failed")
    }

    if(postDB.creator_id !== payload.id){
      throw new ForbiddenError("ERROR: There's no permission to complete the request.")
    }

    //characters quantity
    if(content.length > 300){
      throw new BadRequestError("ERROR: The maximum post length is 300 characters.")
    }

    const newPost = new Post(
      postDB.id, 
      postDB.creator_id,
      postDB.content,
      postDB.upvote,
      postDB.downvote,
      postDB.comments,
      postDB.created_at,
      postDB.updated_at
    )

    newPost.setContent(content)
    newPost.setUpdatedAt(new Date().toISOString())

    await this.postDatabase.updatePost(idToEdit, newPost.toDBModel())
  }

  public deletePost = async (input: DeletePostOutputDTO): Promise<void> => {
    const {idToDelete, token} = input

    const postDB: PostDB | undefined = await this.postDatabase.getPostById(idToDelete)
    if(!postDB){
      throw new NotFoundError("ERROR: 'idToDelete' not found.")
    }

    //login ckeck
    const payload = this.tokenManager.getPayload(token)
    if(payload === null){
      throw new BadRequestError("ERROR: Login failed.")
    }

    //permission check
    if(payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== payload.id){
      throw new ForbiddenError("ERROR: There's no permission to complete the request.")
    }

    await this.postDatabase.deletePost(idToDelete)
  }

  public upvoteOrDownvotePost = async (input: UpvoteOrDownvotePostOutputDTO): Promise<void> => {
    const {idToVote, token, vote} = input

    const postDB: PostDB | undefined = await this.postDatabase.getPostById(idToVote)
    if(!postDB){
      throw new NotFoundError("ERROR: 'idToVote' not found")
    }

    //login ckeck
    const payload = this.tokenManager.getPayload(token)
    if(payload === null){
      throw new BadRequestError("ERROR: Login failed")
    }

    const voteDB = vote ? 1 : 0

    const postUpvoteDownvoteDB : postUpvoteDownvoteDB = {
      post_id: postDB.id,
      user_id: payload.id,
      vote: voteDB
    }

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

    const postUpvoteDownvote = await this.postDatabase.findPostUpvoteDownvote(postUpvoteDownvoteDB)

    //upvote or downvote check 
    if(postUpvoteDownvote === "up"){ //alreary upvoted
      if(vote){
        await this.postDatabase.removeUpvoteDownvote(postUpvoteDownvoteDB)
        post.removeUpvote()
      }else{
        await this.postDatabase.updateUpvoteDownvote(postUpvoteDownvoteDB)
        post.removeUpvote()
        post.addDownvote()
      }
    }else if(postUpvoteDownvote === "down"){ //alreary downvoted
      if(vote){
        await this.postDatabase.updateUpvoteDownvote(postUpvoteDownvoteDB)
        post.removeDownvote()
        post.addUpvote()
      }else{
        await this.postDatabase.removeUpvoteDownvote(postUpvoteDownvoteDB)
        post.removeDownvote()
      }
    }else{
      await this.postDatabase.upvoteDownvotePost(postUpvoteDownvoteDB)
      voteDB ? post.addUpvote() : post.addDownvote()  
    }

    await this.postDatabase.updatePost(idToVote, post.toDBModel())
  }
}