"use client"

import { useEffect, useState } from "react";
import { RecommendationItem, RecommendationItemSkeleton } from "./recommendation-item";
import * as api from "@/api/site";

type User = {
    name: string;
    slug: string;
    avatar: string;
};

export const RecommendationArea = () => {
    const [user, setUser] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [followingList, setFollowingList] = useState<string[]>([]);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        let token = "";
        let slug = "";
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setUser(userObj);
            token = userObj.token;
            slug = userObj.slug;
        } else {
            setUser(null);
        }

        const fetchData = async () => {
            if (!token || !slug) return;
            const [suggestionsRes, followingRes] = await Promise.all([
                api.getSuggestions(token),
                api.getFollowing(slug, token)
            ]);
            setSuggestions(suggestionsRes.users);
            setFollowingList(followingRes.following.map((u: any) => u.slug));
        };
        fetchData();
    }, []);

    if (!user) return null;

    if (suggestions.length === 0) {
        return (
            <div className="bg-gray-700 rounded-3xl">
                <h2 className="text-xl p-6">Quem seguir</h2>
                <div className="flex flex-col gap-4 p-6 pt-0">
                    <RecommendationItemSkeleton />
                    <RecommendationItemSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-700 rounded-3xl">
            <h2 className="text-xl p-6">Quem seguir</h2>
            <div className="flex flex-col gap-4 p-6 pt-0">
                {suggestions.map((suggestion: any) => (
                    <RecommendationItem
                        key={suggestion.slug}
                        user={suggestion}
                    />
                ))}
            </div>
        </div>
    );
}