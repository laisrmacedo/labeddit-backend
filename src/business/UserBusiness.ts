import { UserDatabase, UserDB } from "../database/UserDatabase"
import { GetUsersOutputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { UnprocessableEntity } from "../errors/UnprocessableEntityError";
import { User, USER_ROLES } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

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
    ) { }

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

    public signup = async (input: SignupOutputDTO): Promise<{}> => {
        const { nickname, email, password } = input

        //syntax checking
        if (nickname.length < 4) {
            throw new BadRequestError("ERROR: 'nickname' must be at least 4 characters.")
        }
        if (!email.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
            throw new BadRequestError("ERROR: 'email' must be like 'example@example.example'.")
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new BadRequestError("ERROR: 'password' must be between 8 and 12 characters, with uppercase and lowercase letters and at least one number and one special character")
        }

        //nickname repeat check
        const foundNickname = await this.userDatabase.findUserByNickname(nickname)
        if (foundNickname) {
            throw new UnprocessableEntity("ERROR: 'nickname' already exists.")
        }

        //email repeat check
        const foundEmail = await this.userDatabase.findUserByEmail(email)
        if (foundEmail) {
            throw new UnprocessableEntity("ERROR: 'email' already exists.")
        }

        //signup
        const userInstance = new User(
            this.idGenerator.generate(),
            nickname,
            email,
            await this.hashManager.hash(password),
            "https://picsum.photos/id/447/200/200?grayscale&blur=2",
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        // "https://picsum.photos/id/659/200/200",
        await this.userDatabase.insertUser(userInstance.toDBModel())

        const tokenPayload: TokenPayload = {
            id: userInstance.getId(),
            nickname: userInstance.getNickname(),
            role: userInstance.getRole()
        }

        const output = {
            token: this.tokenManager.createToken(tokenPayload)
        }

        return output
    }

}