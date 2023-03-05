import { USER_ROLES } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    avatar: string,
    role: USER_ROLES,
    created_at: string
}

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async getUsers(q: string | undefined): Promise<UserDB[]>{
        let usersDB
        if(q){
          const result = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where("nickname", "LIKE", `%${q}%`)
          usersDB = result
        }else{
          const result = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          usersDB = result
        }
        return usersDB
      }

}