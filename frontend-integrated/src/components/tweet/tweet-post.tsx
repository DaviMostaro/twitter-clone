"use client"

import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import * as api from "@/api/site";

interface Props {
    answer?: number;
}

export const TweetPost = ({answer}: Props) => {
    const [postBody, setPostBody] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const [image, setImage] = useState<File | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            setUser(JSON.parse(userString));
        } else {
            setUser(null);
        }
    }, []);

    if (!user) return null;

    const token = user.token;
    console.log(token);

    const handleImageUpload = () => {
        imageInputRef.current?.click();
    };

    const onImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];
        if (selectedImage) {
            setImage(selectedImage);
        }
    };

    const handlePostClick = async () => {
        if (!postBody.trim()) return; 
        try {
            await api.postTweet(postBody, token, image ?? undefined, answer);
            setPostBody("");
            setImage(null);
            alert("Tweet postado com sucesso!");
            window.location.reload()
        } catch (error) {
            console.error("Erro ao postar tweet:", error);
            alert("Erro ao postar tweet");
        }
    };

    return (
        <div className="flex gap-6 px-8 py-6 border-b-2 border-gray-900">
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={onImageSelected}
            />
            <div>
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="size-12 rounded-full"
                />
            </div>

            <div className="flex-1">
                <div 
                    className="min-h-14 outline-none text-lg text-white empty:before:text-gray-500 empty:before:content-[attr(data-placeholder)]"
                    contentEditable
                    role="textbox"
                    data-placeholder="O que esta acontecendo?"
                    onInput={(e) => setPostBody((e.target as HTMLDivElement).innerText)}
                ></div>
                {image !== null && (
                    <div className="mt-2 relative inline-block">
                        <img src={URL.createObjectURL(image)} alt="Imagem" className="h-24 w-32 rounded-sm" />
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition cursor-pointer"
                            aria-label="Remover imagem"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-center mt-2">
                    <div onClick={handleImageUpload} className="cursor-pointer">
                        <FontAwesomeIcon icon={faImage} className="size-6" />
                    </div>
                    <div className="w-28">
                        <Button
                            label="Postar"
                            size={2}
                            onClick={handlePostClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 