"use client";

import { HomeFeed } from "@/components/home/home-feed";
import { HomeHeader } from "@/components/home/home-header";
import { TweetPost } from "@/components/tweet/tweet-post";
import { useEffect } from "react";

export default function Page() {

    // useEffect(() => {
    //     const userString = localStorage.getItem("user");
    //     let userData = {};
    //     if (userString && userString !== "undefined") {
    //         userData = JSON.parse(userString);
    //     }
    //     const token = (userData as any)?.token || "";
    //     if (!token) {
    //         window.location.href = "/signin";
    //     }
    // }, []);

    return (
        <div>
            <HomeHeader />
            <TweetPost />
            <HomeFeed />
        </div>
    );
}