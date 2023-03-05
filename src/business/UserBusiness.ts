import { UserDatabase, UserDB } from "../database/UserDatabase"
import { GetUsersOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { User, USER_ROLES } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export interface UserBusinessModel {
    id: string,
    nickname: string,
    email: string,
    password: string,
    avatar: string,
    role: USER_ROLES,
    createdAt: string
}

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public getUsers = async (input: GetUsersOutputDTO): Promise<UserBusinessModel[]> => {
        const { token, q } = input
    
        //permission check
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
          throw new BadRequestError("ERROR: Login failed")
        }
        if (payload.role !== USER_ROLES.ADMIN) {
          throw new ForbiddenError("ERROR: Access denied.")
        }
    
        const usersDB: UserDB[] = await this.userDatabase.getUsers(q)
        const users = usersDB.map((userDB) => {
          const user = new User(
            userDB.id,
            userDB.nickname,
            userDB.email,
            userDB.password,
            userDB.avatar,
            userDB.role,
            userDB.created_at
          )
          return user.toBusinessModel()
        })
    
        return users
      }

}