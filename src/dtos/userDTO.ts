import { BadRequestError } from "../errors/BadRequestError"

export interface GetUsersOutputDTO { 
  token: string,
  q: string | undefined
}

export interface SignupOutputDTO {
  nickname: string,
  email: string,
  password: string
}

export interface LoginOutputDTO {
  email: string,
  password: string
}

export interface DeleteUserOutput {
  idToDelete: string, 
  token: string
}

export class UserDTO {
  public getUsersInputDTO(
    token: unknown,
    q: unknown
  ):GetUsersOutputDTO{
    
    if(!token){
      throw new BadRequestError("ERROR: log in to see the users.")
    }
    if (typeof token !== "string") {
      throw new BadRequestError("ERROR: 'token' must be of type string.")
    }

    if (q !== undefined && typeof q !== "string") {
      throw new BadRequestError("ERROR: the query must be of type string.")
    }

    const dto: GetUsersOutputDTO = {
      token,
      q
    }

    return dto
  }

  public signupInputDTO(
    nickname: unknown,
    email: unknown,
    password: unknown
  ): SignupOutputDTO{

    if (!nickname ||  nickname === "") {
      throw new BadRequestError("ERROR: all fields are mandatory.")
    }
    if (typeof nickname !== "string") {
      throw new BadRequestError("ERROR: 'nickname' must be of type string.")
    }

    if(!email || email === ""){
      throw new BadRequestError("ERROR: all fields are mandatory.")
    }
    if (typeof email !== "string") {
      throw new BadRequestError("ERROR: 'email' must be of type string.")
    }

    if(!password || password === ""){
      throw new BadRequestError("ERROR: all fields are mandatory.")
    }
    if (typeof password !== "string") {
      throw new BadRequestError("ERROR: 'password' must be of type string.")
    }

    const dto: SignupOutputDTO = {
      nickname,
      email,
      password
    }

    return dto
  }

  public loginInputDTO(
    email: unknown,
    password: unknown
  ): LoginOutputDTO{

    if(!email || email === ""){
      throw new BadRequestError("ERROR: all fields are mandatory.")
    }
    if (typeof email !== "string") {
      throw new BadRequestError("ERROR: 'email' must be of type string.")
    }

    if(!password || password === ""){
      throw new BadRequestError("ERROR: all fields are mandatory.")
    }
    if (typeof password !== "string") {
      throw new BadRequestError("ERROR: 'password' must be of type string.")
    }

    const dto: LoginOutputDTO = {
      email,
      password
    }

    return dto
  }

  public deleteUserInput(
    idToDelete: string, 
    token: unknown
    ): DeleteUserOutput{
    
    if(idToDelete === ":id"){
      throw new BadRequestError("ERROR: report the id of the user to be deleted")
    }
    
    if(!token){
      throw new BadRequestError("ERROR: log in to delete the user.")
    }
    if (typeof token !== "string") {
      throw new BadRequestError("ERROR: 'token' must be of type string.")
    }
    
    const dto: DeleteUserOutput = {
      idToDelete,
      token
    }

    return dto
  }
}