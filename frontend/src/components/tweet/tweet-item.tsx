"use client"

import { Tweet } from "@/types/tweet";
import { formatRelativeTime } from "@/utils/format-relative";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet, faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

type Props = {
    tweet: Tweet;
    hideComments?: boolean; 
}

export const TweetItem = ({tweet, hideComments}: Props) => {
    const [liked, setLiked] = useState(tweet.liked);

    const handleLikeClick = () => {
        setLiked(!liked);
    };

    return (
        <div className="flex gap-2 p-6 border-b-2 border-gray-900">
            <div>
                <Link href={`/${tweet.user.slug}`}>
                    <img 
                        src={tweet.user.avatar} 
                        alt={tweet.user.name} 
                        className="size-10 rounded-full"
                    />
                </Link>
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-3">
                    <div className="font-bold text-md">
                        <Link href={`/${tweet.user.slug}`}>
                            {tweet.user.name}
                        </Link>
                    </div>
                    <div className="text-xs text-gray-500">@{tweet.user.slug} - {formatRelativeTime(tweet.dataPost)}</div>
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
                                    <div className="text-md">{tweet.commentCount}</div>
                                </div>
                            </Link>
                        </div>
                    }
                    
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 cursor-pointer">
                            <FontAwesomeIcon icon={faRetweet} className="size-6" />
                            <div className="text-md">{tweet.retweetCount}</div>
                        </div>
                    </div>
                    <div className={`${hideComments ? 'justify-end mr-8' : 'flex-1'}`}>
                        <div onClick={handleLikeClick} className={`inline-flex items-center gap-2 cursor-pointer ${liked ? 'text-red-400' : ''}`}>
                            <FontAwesomeIcon icon={liked ? faHeartFilled : faHeart} className="size-6" />
                            <div className="text-md">{tweet.likeCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}