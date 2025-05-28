"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const NavMyProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            setUser(JSON.parse(userString));
            console.log(user);
        } else {
            setUser(null);
        }
    }, []);

    if (!mounted || !user) return null;

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
                <Link
                    href={`/${user.slug}`}
                    className="block truncate"
                >{user.name}
                </Link>
                <div className="text-sm text-gray-400 truncate">@{user.slug}</div>
            </div>
        </div>
    );
}