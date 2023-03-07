export interface PostBusinessModel {
  id: string, 
  creatorId: string,
  content: string, 
  upvote: number,
  downvote: number,
  comments: number,
  createdAt: string,
  updatedAt: string
}