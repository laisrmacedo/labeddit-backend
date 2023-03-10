import { BadRequestError } from "../errors/BadRequestError"

export interface GetCommentsOutputDTO {
  token: string
}

export interface CreateCommenteOutputDTO {
  postIdToComment: string,
  token: string,
  content: string
}

export interface EditCommentOutputDTO {
  idToEdit: string,
  token: string,
  content: string
}

export class CommentDTO {
  public getCommentsInputDTO(
    token: string | undefined
  ):GetCommentsOutputDTO {

    if(!token){
      throw new BadRequestError("ERROR: log in to see the comments.")
    }

    const dto: GetCommentsOutputDTO = {
      token
    }
    
    return dto
  }

  public createCommentInputDTO(
    postIdToComment: string,
    token: string | undefined,
    content: unknown
  ): CreateCommenteOutputDTO{

    if(postIdToComment === ":id"){
      throw new BadRequestError("ERROR: report the id of the post to be commented.")
    }
    
    if(!token){
      throw new BadRequestError("ERROR: log in to create a comments.")
    }

    if(!content || content === ""){
      throw new BadRequestError("ERROR: content field is mandatory.")
    }
    if (typeof content !== "string") {
      throw new BadRequestError("ERROR: 'content' must be of type string.")
    }

    const dto: CreateCommenteOutputDTO = {
      postIdToComment,
      token,
      content
    }
    
    return dto
  }

  public editCommentInputDTO(
    idToEdit: string,
    token: string | undefined,
    content: unknown,
  ): EditCommentOutputDTO{

    if(idToEdit === ":id"){
      throw new BadRequestError("ERROR: report the id of the comment to be edited.")
    }

    if(!token){
      throw new BadRequestError("ERROR: log in to create a comment.")
    }

    if(!content || content === ""){
      throw new BadRequestError("ERROR: content field is mandatory.")
    }
    if (typeof content !== "string") {
      throw new BadRequestError("ERROR: 'content' must be of type string.")
    }

    const dto: EditCommentOutputDTO = {
      idToEdit,
      token,
      content
    }
    
    return dto
  }
}