"use client";

import { ProfileFeed } from "@/components/profile/profile-feed";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as api from "@/api/site";
import { useParams } from "next/navigation";
import { BlackButton } from "@/components/ui/blackbutton";
import { PaginationItem } from "@/components/ui/paginationItem";

export default function Page() {    
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const params = useParams(); 
    const userProfile = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    const [page, setPage] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const handleBackClick = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextClick = () => {
        if (hasMore) setPage(page + 1);
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);

        const fetchProfile = async () => {
            if (!userProfile || !userData.token) return;
            const response = await api.getUser(userProfile, userData.token);
            setProfile(response.user);
            setFollowingCount(response.followingCount);
            setFollowersCount(response.followersCount);

            const followingRes = await api.getFollowing(userData.slug, userData.token);
            setIsFollowing(followingRes.following.some((u: any) => u.slug === userProfile));
        };
        fetchProfile();
    }, [userProfile]);

    const handleClickButton = async () => {
        try {
            const response = await api.followUser(profile.slug, user.token);
            setIsFollowing(!isFollowing);
            window.location.reload();
        } catch (e) {
            alert("Erro ao seguir usuário");
        }
    }

    if (!user || !profile) return null;

    const isMe = user.slug === userProfile;

    if (!userProfile) return null;

    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="font-bold text-lg">{profile.name}</div>
                <div className="text-xs text-gray-500">{profile.postCount} posts</div>
            </GeneralHeader>
            <section className="border-b-2 border-gray-900">
                <div 
                    className="bg-gray-500 h-28 bg-no-repeat bg-cover bg-center"
                    style={{backgroundImage: `url(${profile.cover})`}}
                ></div>
                <div className="-mt-12 flex justify-between items-end px-6">
                    <img 
                        src={profile.avatar}
                        alt={profile.name}
                        className="size-24 rounded-full"
                    />
                    <div className="w-32">
                        {isMe && 
                            <Link href={`/${profile.slug}/edit`}>
                                <Button label="Editar Perfil" size={2} />
                            </Link>
                        }
                        {!isMe && !isFollowing &&
                            <Button onClick={handleClickButton} label="Seguir" size={2} />
                        }
                        {!isMe && isFollowing &&
                            <Button
                                label="Seguindo"
                                onClick={handleClickButton}
                                size={2}
                            />
                        }
                    </div>
                </div>

                <div className="px-6 mt-4">
                    <div className="text-xl font-bold">{profile.name}</div>
                    <div className="text-gray-500">@{profile.slug}</div>
                    <div className="py-5 text-lg text-gray-500">{profile.bio}</div>
                    {profile.link &&
                        <div className="flex gap-2 items-center">
                            <FontAwesomeIcon icon={faLink} className="size-5" />
                            <Link href={profile.link} target="_blank" className="text-blue-300">{profile.link}</Link>
                        </div>
                    }
                    <div className="my-5 flex gap-6">
                        <div className="text-xl text-gray-500"><span className="text-white">{followingCount || 0}</span> Seguindo</div>
                        <div className="text-xl text-gray-500"><span className="text-white">{followersCount || 0}</span> Seguidores</div>
                    </div>
                </div>
            </section>
            <ProfileFeed
                userProfile={userProfile}
                page={page}
                setHasMore={setHasMore}
            />
            <PaginationItem
                page={page}
                backAction={handleBackClick}
                nextAction={handleNextClick}
                hasMore={hasMore}
            />
        </div>
    );
}