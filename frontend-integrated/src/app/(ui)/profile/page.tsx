"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
    }, []);

    useEffect(() => {
        if (user && user.slug) {
            redirect('/' + user.slug);
        }
    }, [user]);

    return null;
}