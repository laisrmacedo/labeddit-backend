export interface CommentDB {
  id: string, 
  creator_id: string,
  post_id: string,
  content: string, 
  upvote: number,
  downvote: number,
  created_at: string,
  updated_at: string
}

export const commentDBMock: CommentDB[] = [
  {
    id: "id-mock",
    creator_id: "id-mock",
    post_id: "id-mock",
    content: "comment-mock",
    upvote: 10,
    downvote: 10,
    created_at: "2023-01-01",
    updated_at: "2023-02-01"
  }
]