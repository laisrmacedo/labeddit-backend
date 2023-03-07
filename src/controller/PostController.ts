import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostDTO } from "../dtos/postDTO";

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
      
    }
  }
}