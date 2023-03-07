import express from "express"
import { PostController } from "../controller/PostController"

export const postRouter = express.Router()

const postController = new PostController(

)

  
  // userRouter.get("/", userController.getUsers)
  // userRouter.post("/signup", userController.signup)
  // userRouter.post("/login", userController.login)
  // userRouter.put("/:id", userController.editUser)
  // userRouter.delete("/:id", userController.deleteUser)