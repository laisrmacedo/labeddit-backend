import { CommentBusinessModel } from "../business/CommentBusiness"
import { CommentDB } from "../database/CommentDatabase"

export class Comment {
  constructor(
    private id: string, 
    private creatorId: string,
    private postId: string,
    private content: string, 
    private upvote: number,
    private downvote: number,
    private createdAt: string,
    private updatedAt: string
  ){}

  public getId():string{
    return this.id
  }

  public getCreatorId():string{
    return this.creatorId
  }

  public getPostId():string{
    return this.postId
  }

  public getContent():string{
    return this.content
  }
  public setContent(value: string): void{
    this.content = value
  }

  public getUpvote():number{
    return this.upvote
  }
  public setUpvote(value: number): void{
    this.upvote = value
  }

  public getDownvote():number{
    return this.downvote
  }
  public setDownvote(value: number): void{
    this.downvote = value
  }
  
  public getCreatedAt():string{
    return this.createdAt
  }

  public getUpdatedAt():string{
    return this.updatedAt
  }
  public setUpdatedAt(value: string): void{
    this.updatedAt = value
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id, 
      creator_id: this.creatorId,
      post_id: this.postId,
      content: this.content, 
      upvote: this.upvote,
      downvote: this.downvote,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
  }

  public toBusinessModel(): CommentBusinessModel {
    return {
      id: this.id, 
      creatorId: this.creatorId,
      postId: this.postId,
      content: this.content, 
      upvote: this.upvote,
      downvote: this.downvote,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

}