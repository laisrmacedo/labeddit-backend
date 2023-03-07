import { BadRequestError } from "../errors/BadRequestError"

export interface GetPostsOutputDTO {
  token: string,
  q: string | undefined
}

export interface CreatePostOutputDTO {
  token: string,
  content: string
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

  public createPostInputDTO(
    token: string | undefined,
    content: unknown,
  ): CreatePostOutputDTO{

    if(!token){
      throw new BadRequestError("ERROR: log in to create a posts.")
    }

    if(!content || content === ""){
      throw new BadRequestError("ERROR: content field is mandatory.")
    }
    if (typeof content !== "string") {
      throw new BadRequestError("ERROR: 'content' must be of type string.")
    }

    const dto: CreatePostOutputDTO = {
      token,
      content
    }
    
    return dto
  }
}