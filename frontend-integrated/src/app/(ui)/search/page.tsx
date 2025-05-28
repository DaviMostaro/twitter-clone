"use client";

import { TweetItem } from "@/components/tweet/tweet-item";
import { GeneralHeader } from "@/components/ui/general-header";
import { SearchInput } from "@/components/ui/search-input";
import { tweet } from "@/data/tweet";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as api from "@/api/site";
import { PaginationItem } from "@/components/ui/paginationItem";

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
    const [token, setToken] = useState<string>("");
    const [tweets, setTweets] = useState<Array<Tweet>>([]);
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const handleBackClick = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextClick = () => {
        if (hasMore) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        if (!q) {
            redirect('/');
            return;
        }
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setToken(userObj.token);
        } else {
            redirect("/signin");
        }
    }, [q]);

    useEffect(() => {
        setLoading(true);
        if (!q || !token) return;
        const fetchTweet = async () => {
            const response = await api.searchTweets(q, token, page);
            console.log(response);
            setTweets(response.tweets || []);
            setHasMore(response.tweets.length > 0);
        };
        fetchTweet();
        setLoading(false);
    }, [q, token, page]);

    return (
        <div>
            <GeneralHeader backHref="/">
                <SearchInput defaultValue={q || ""} />
            </GeneralHeader>
            <div className="border-t-2 border-gray-900">
                {tweets.length > 0 ? (
                    tweets.map((tweet: any) => (
                        <TweetItem key={tweet.id} tweet={tweet} />
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-8 mb-25">
                        Parece que você chegou ao fim :/ 
                    </div>
                )}
               {!loading && (
                    <PaginationItem
                        page={page}
                        backAction={handleBackClick}
                        nextAction={handleNextClick}
                        hasMore={hasMore}
                    />
                )}
            </div>
        </div>
    );
}