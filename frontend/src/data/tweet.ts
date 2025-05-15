import { Tweet } from "@/types/tweet";
import { user } from "./user";

export const tweet: Tweet = {
    id: 123,
    user: user,
    body: 'Outro dia Magico', 
    image: 'https://images.wondershare.com/repairit/aticle/2021/08/twitter-header-photo-issues-1.jpg',
    likeCount: 523,
    commentCount: 61,  
    retweetCount: 0,  
    liked: true,  
    retweeted: false,
    dataPost: new Date(2024, 8, 1, 10, 0, 0)
}