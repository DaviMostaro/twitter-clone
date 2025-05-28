import { tweet } from "@/data/tweet";
import { TweetItem } from "../tweet/tweet-item";
import * as api from "@/api/site";
import { useEffect, useState } from "react";
import { PaginationItem } from "../ui/paginationItem";

type Tweet = {
    id: number;
    userSlug: string;
    body: string;
    image: string | null;
    createdAt: string;
    answerOf: string | null;
    user: {
        name: string;
        slug: string;
        avatar: string;
    };
    likes: object[];
};

export const HomeFeed = () => {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [page, setPage] = useState(0);
    const [user, setUser] = useState<any>(null);
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
        const userString = localStorage.getItem("user");
        let token = "";
        let userId = "";
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setUser(userObj);
            token = userObj.token;
            userId = userObj.id; 
        } else {
            setUser(null);
        }

        const fetchTweets = async () => {
            setLoading(true);
            try {
                if (!token) return;
                const response = await api.getFeed(page, token);
                if (response.tweets) {
                    const tweetsWithLiked = response.tweets.map((tweet: any) => ({
                        ...tweet,
                        liked: tweet.likes.some((like: any) => like.userId === userId)
                    }));
                    setTweets(tweetsWithLiked);
                    setHasMore(response.tweets.length > 0);

                } else {
                    setTweets([]);
                    setHasMore(false);
                    if (page > 0) setPage(page - 1);
                    console.error("Error fetching tweets:", response);
                }
            } catch (error) {
                setHasMore(false);
                console.error("Error fetching tweets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTweets();
    }, [page]);

    return (
        <div>
            {tweets.length > 0 ? (
                tweets.map((tweet: any) => (
                    <TweetItem key={tweet.id} tweet={tweet} />
                ))
            ) : (
                <div className="text-center text-gray-500 py-8 mb-60">
                    Parece que você chegou ao fim :/ Siga mais pessoas para ver mais tweets!
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
    );
}