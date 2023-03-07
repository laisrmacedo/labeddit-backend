import { BadRequestError } from "../errors/BadRequestError"

export interface GetPostsOutputDTO {
  token: string,
  q: string | undefined
}

export class PostDTO {
  public getPostsInputDTO(
    token: string | undefined,
    q: unknown
  ):GetPostsOutputDTO {

    if(!token){
      throw new BadRequestError("ERROR: log in to see the posts.")
    }

    if (q !== undefined && typeof q !== "string") {
      throw new BadRequestError("ERROR: the query must be of type string.")
    }

    const dto: GetPostsOutputDTO = {
      token,
      q
    }
    
    return dto
  }
}