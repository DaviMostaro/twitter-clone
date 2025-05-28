"use client";

import { User } from "@/types/user";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { BlackButton } from "./blackbutton";
import * as api from "@/api/site";

type Props = {
    user: User;
    isFollowing?: boolean;
}

export const RecommendationItem = ({ user }: Props) => {
    const [token, setToken] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            const userObj = JSON.parse(userString);
            setToken(userObj.token);
        }
    }, []);

    const handleFollowButton = async () => {
        try {
            setIsLoading(true);
            const response = await api.followUser(user.slug, token);
            setIsFollowing(!isFollowing);
        } catch (e) {
            alert("Erro ao seguir usuário");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            <div className="size-10 mr-2 rounded-full overflow-hidden">
                <Link href={`/${user.slug}`}>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-full"
                    />
                </Link>
            </div>
            <div className="flex-1 overflow-hidden">
                <Link href={`/${user.slug}`} className="block truncate">
                    {user.name}
                </Link>
                <div className="truncate text-sm text-gray-400">
                    @{user.slug}
                </div>
            </div>
            <div className="pl-2 w-20">
                {!isFollowing && 
                    <Button
                        label="Seguir"
                        onClick={handleFollowButton}
                        size={3}
                    />
                }
                {isFollowing && 
                    <BlackButton
                        label="Seguindo"
                        onClick={handleFollowButton}
                        size={3}
                    />
                }
            </div>
        </div>
    );
};

export const RecommendationItemSkeleton = () => {
    return(
        <div className="animate-pulse flex items-center">
            <div className="size-10 mr-2 rounded-ful bg-gray-600"></div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="bg-gray-600 w-3/4 h-4"></div>
                <div className="bg-gray-600 w-1/4 h-4"></div>
            </div>
        </div>
    );
}
