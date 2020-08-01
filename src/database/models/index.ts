// A simple way to not make too much imports on database/index.ts
import User from "./user"
import Video from "./videos"
import SubscribedList from "./subscribedlist"
import VideosLikesList from "./videolikeslist"
import CommentsLikesList from "./commentslikeslist"
import Comment from "./comments"

export {
  User,
  Video,
  Comment,
  SubscribedList,
  VideosLikesList,
  CommentsLikesList,
}
