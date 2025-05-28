"use client"

import { useEffect, useState } from "react";
import { TrendingItem, TrendingItemSkeleton } from "./trending-item";
import * as api from "../../api/site";

export const TrendingArea = () => {
    const [trendsData, setTrendsData] = useState<any>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        let storedUser = {};
        if (userString && userString !== "undefined") {
            storedUser = JSON.parse(userString);
        }
        const token = (storedUser as any)?.token || "";
        if (token) {
            api.getTrends(token).then(setTrendsData);
        }
    }, []);

    if (!trendsData) {
        return (
            <div className="bg-gray-700 rounded-3xl">
                <h2 className="text-xl p-6">O que está acontecendo</h2>
                <div className="flex flex-col gap-4 p-6 pt-0">
                    <TrendingItemSkeleton />
                    <TrendingItemSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-700 rounded-3xl">
            <h2 className="text-xl p-6">O que está acontecendo</h2>
            <div className="flex flex-col gap-4 p-6 pt-0">
                {trendsData.trends.map((trend: any) => (
                    <TrendingItem
                        key={trend.hashtag}
                        label={trend.hashtag}
                        count={trend.counter}
                    />
                ))}
            </div>
        </div>
    );
}