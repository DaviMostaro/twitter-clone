"use client";

import { TweetItem } from "../tweet/tweet-item";
import * as api from "@/api/site";
import { useEffect, useState } from "react";

type props = {
    userProfile: string;
    page: number;
    setHasMore: (hasMore: boolean) => void;
}

export const ProfileFeed = ({ userProfile, page, setHasMore }: props) => {
    const [tweets, setTweets] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const token = storedUser?.token || "";
        if (token) {
            (async () => {
                try {
                    const response = await api.getUserTweets(userProfile, page, token);
                    if (response.tweets) {
                        setTweets(response.tweets);
                        setHasMore(response.tweets.length > 0);
                    } else {
                        setTweets([]);
                        setHasMore(false);
                    }
                } catch (error) {
                    setTweets([]);
                    setHasMore(false);
                }
            })();
        }
    }, [userProfile, page, setHasMore]);

    return (
        <div>
            {tweets.length > 0 ? (
                tweets.map((tweet: any) => (
                    <TweetItem key={tweet.id} tweet={tweet} />
                ))
            ) : (
                <div className="text-center text-gray-500 py-8 mb-25">
                    Parece que você chegou ao fim :/
                </div>
            )}
        </div>
    );
}