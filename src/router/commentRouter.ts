import express from "express"
import { CommentController } from "../controller/CommentController"

export const commentRouter = express.Router()

const commentController = new CommentController(

)