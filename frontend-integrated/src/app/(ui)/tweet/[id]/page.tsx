"use client";

import { TweetItem } from "@/components/tweet/tweet-item";
import { TweetPost } from "@/components/tweet/tweet-post";
import { GeneralHeader } from "@/components/ui/general-header";
import { useEffect, useState } from "react";
import * as api from "@/api/site";
import { useParams } from "next/navigation";

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

export default function Page() {
    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>("");
    const [tweetId, setTweetId] = useState<number>(0);
    const [answers, setAnswers] = useState<Array<Tweet> | null>(null);
    
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;


    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setUser(userObj);
            setToken(userObj.token);
        } else {
            setUser(null);
        }

        if (id) {
            setTweetId(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (!tweetId || !token) return;
        const fetchTweet = async () => {
            const response = await api.getTweet(tweetId, token);
            setTweet(response.tweet);
        };
        fetchTweet();
    }, [tweetId, token]);


    useEffect(() => {
        if (!tweet || !token) return;
        const fetchComments = async () => {
            const response = await api.getTweetAnswers(tweet.id, token);
            setAnswers(response.answers);
        };
        fetchComments();
    }, [tweet, token]);

    if(!tweet || !token) return null;

    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="font-bold text-lg">Voltar</div>
            </GeneralHeader>
            <div className="border-t-2 border-gray-900">
                <TweetItem tweet={tweet} />

                <div className="border-y-8 border-gray-900">
                    <TweetPost answer={tweet.id} />
                </div>

                {answers && 
                    answers.map((answer: any) => 
                        <TweetItem 
                            key={answer.id} 
                            tweet={answer} 
                            hideComments
                        />
                )}
            </div>
        </div>
    );
}