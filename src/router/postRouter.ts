import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostController } from "../controller/PostController"
import { PostDatabase } from "../database/PostDatabase"
import { PostDTO } from "../dtos/postDTO"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostController(
  new PostDTO(),
  new PostBusiness(
    new PostDatabase(),
    new TokenManager,
    new IdGenerator()
  )
)

postRouter.get("/", postController.getPosts)
// postRouter.post("/signup", postController.signup)
// postRouter.post("/login", postController.login)
// postRouter.put("/:id", postController.editUser)
// postRouter.delete("/:id", postController.deleteUser)