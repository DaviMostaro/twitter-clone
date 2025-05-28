"use client"

import { formatRelativeTime } from "@/utils/format-relative";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet, faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as api from "@/api/site";

type Tweet = {
    id: number;
    userSlug: string;
    body: string;
    image: string | null;
    createdAt: string;
    answerOf: number | null;
    user: { name: string; slug: string; avatar: string };
    likes: Array<object>;
}

type Props = {
    tweet: Tweet;
    hideComments?: boolean; 
}

type User = {
    avatar: string;
    cover: string;
    slug: string;
    name: string;
    bio: string;
    link: string;
};


export const TweetItem = ({tweet, hideComments}: Props) => {
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>("");
    const [tweetUser, setTweetUser] = useState<User>();
    const [likeCount, setLikedCount] = useState<number>((tweet.likes ?? []).length);
    const [commentCount, setCommentCount] = useState<number>(0);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setUser(userObj);
            setToken(userObj.token);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setLiked((tweet.likes ?? []).some((like: any) => like.userId === user.id));
        }
    }, [user, tweet.likes]);

    useEffect(() => {
        if (!token) return;

        const fetchTweetUser = async () => {
            const response = await api.getUser(tweet.userSlug, token);
            setTweetUser(response.user);
        };
        fetchTweetUser();

        const fetchCommentCount = async () => {
            const response = await api.getTweetAnswers(tweet.id, token);
            setCommentCount(response.answers.length);
        };
        fetchCommentCount();
    }, [tweet.userSlug, tweet.id, token]);

    if (!tweet.userSlug || !user || !tweetUser) return null;

    const handleLikeClick = async () => {
        await api.likeTweet(tweet.id, token);
        if (liked) {
            setLiked(false);
            setLikedCount((count) => count - 1);
        } else {
            setLiked(true);
            setLikedCount((count) => count + 1);
        }
    };

    return (
        <div className="flex gap-2 p-6 border-b-2 border-gray-900">
            <div>
                <Link href={`/${tweet.userSlug}`}>
                    <img 
                        src={tweetUser?.avatar} 
                        alt={tweetUser?.name} 
                        className="size-10 rounded-full"
                    />
                </Link>
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3">
                    <div className="font-bold text-md">
                        <Link href={`/${tweet.userSlug}`}>
                            {tweetUser?.name}
                        </Link>
                    </div>
                    <div className="text-xs text-gray-500">@{tweet.userSlug} - {formatRelativeTime(new Date(tweet.createdAt))}</div>
                </div>
                <div className="py-4 text-lg">{tweet.body}</div>

                {tweet.image && 
                    <div className="w-full">
                        <img 
                            src={tweet.image}
                            alt=""
                            className="w-full rounded-2xl"
                        />
                    </div>
                }

                <div className={`flex mt-6 text-gray-500`}>
                    {!hideComments &&
                        <div className="flex-1">
                            <Link href={`/tweet/${tweet.id}`}>
                                <div className="inline-flex items-center gap-2 cursor-pointer">
                                    <FontAwesomeIcon icon={faComment} className="size-6" />
                                    <div className="text-md">{commentCount}</div>
                                </div>
                            </Link>
                        </div>
                    }
                    
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 cursor-pointer">
                            <FontAwesomeIcon icon={faRetweet} className="size-6" />
                            {/* <div className="text-md">{tweet.retweetCount}</div> */}
                        </div>
                    </div>
                    <div className={`${hideComments ? 'justify-end mr-8' : 'flex-1'}`}>
                        <div onClick={handleLikeClick} className={`inline-flex items-center gap-2 cursor-pointer ${liked ? 'text-red-400' : ''}`}>
                            <FontAwesomeIcon icon={liked ? faHeartFilled : faHeart} className="size-6" />
                            <div className="text-md">{likeCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}