export interface CommentBusinessModel {
  id: string, 
  creatorId: string,
  postId: string,
  content: string, 
  upvote: number,
  downvote: number,
  createdAt: string,
  updatedAt: string
}