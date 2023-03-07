import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostDTO } from "../dtos/postDTO";
import { BaseError } from "../errors/BaseError";

export class PostController {
  constructor(
    private postDTO: PostDTO,
    private postBusiness: PostBusiness
  ){}

  public getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = this.postDTO.getPostsInputDTO(
        req.headers.authorization,
        req.query.q
      )

      const output = await this.postBusiness.getPosts(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)
      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.send("Unexpected error")
      }
    }
  }

  public createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = this.postDTO.createPostInputDTO(
        req.headers.authorization,
        req.body.content
      )

      await this.postBusiness.createPost(input)
      res.status(201).end()
  
    } catch (error) {
      console.log(error)
      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.send("Unexpected error")
      }
    }
  }
}