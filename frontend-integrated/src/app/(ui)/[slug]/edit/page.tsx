"use client";

import { ProfileFeed } from "@/components/profile/profile-feed";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { faCamera, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as api from "@/api/site";
import { redirect } from "next/navigation";


export default function Page() {    

    const [user, setUser] = useState<any>(null);
    const [newName, setNewName] = useState<string>("");
    const [newBio, setNewBio] = useState<string>("");
    const [newLink, setNewLink] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        let userData = {};
        if (userString && userString !== "undefined") {
            userData = JSON.parse(userString);
        }
        const token = (userData as any)?.token || "";
        setToken(token);
        setUser(userData);
        setNewName((userData as any).name || "");
        setNewBio((userData as any).bio || "");
        setNewLink((userData as any).link || "");
    }, []);

    if (!user) return null;

    const editSave = async () => {
        try {
            await api.updateUser(
                token,
                newName,
                newBio,
                newLink
            );

            const updatedUserData = await api.getUser(user.slug, token);

            const fullUser = {
                ...updatedUserData.user,
                token
            };

            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);

            alert("Alterações salvas!");
        } catch (e: any) {
            alert("Erro ao salvar: " + (e.response?.data?.errors?.join(', ') || e.message));
            console.error(e);
        }
    };

    const handleChangeCover = () => {
        coverInputRef.current?.click();
    };

    const handleChangeAvatar = () => {
        avatarInputRef.current?.click();
    };

    const onCoverSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            await api.updateUserCover(e.target.files[0], token);
            const updatedUserData = await api.getUser(user.slug, token);
            const fullUser = { ...updatedUserData.user, token };
            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);
            window.location.reload();
        } catch (err) {
            alert("Erro ao alterar capa.");
        }
    };

    const onAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            await api.updateUserAvatar(e.target.files[0], token);
            const updatedUserData = await api.getUser(user.slug, token);
            const fullUser = { ...updatedUserData.user, token };
            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);
            window.location.reload();
        } catch (err) {
            alert("Erro ao alterar avatar.");
        }
    };

    const handleExcludeCover = async () => {
        try {
            const formData = new FormData();
            await api.updateUserCover(undefined, token);
            const updatedUserData = await api.getUser(user.slug, token);
            const fullUser = { ...updatedUserData.user, token };
            localStorage.setItem("user", JSON.stringify(fullUser));
            setUser(fullUser);
            window.location.reload();
        } catch (err) {
            alert("Erro ao remover capa.");
        }
    };

    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="font-bold text-lg">Editar perfil</div>         
            </GeneralHeader>
            <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                style={{ display: "none" }}
                onChange={onCoverSelected}
            />
            <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                style={{ display: "none" }}
                onChange={onAvatarSelected}
            />
            <section className="border-b-2 border-gray-900">
                <div 
                    className="flex justify-center items-center gap-4 bg-gray-500 h-28 bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.cover || "/defaultCover.jpg"})` }}
                >
                    <div onClick={handleChangeCover} className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                        <FontAwesomeIcon icon={faCamera} className="size-6" />
                    </div>
                    <div onClick={handleExcludeCover} className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                        <FontAwesomeIcon icon={faXmark} className="size-6" />
                    </div>
                </div>
                <div className="-mt-12 px-6">
                    <img 
                        src={user.avatar || "/default.jpg"} 
                        alt={user.name}
                        className="size-24 rounded-full"
                    />
                    <div className="-mt-24 size-24 flex justify-center items-center">
                        <div onClick={handleChangeAvatar} className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                            <FontAwesomeIcon icon={faCamera} className="size-6" />
                        </div>
                    </div>
                </div>             
            </section>
            <section className="p-6 flex flex-col gap-4">
                <label>
                    <p className="text-lg text-gray-500 mb-2">Nome</p>
                    <Input 
                        placeholder="Digite seu nome"
                        value={newName}
                        onChange={setNewName}
                    />
                </label>
                <label>
                    <p className="text-lg text-gray-500 mb-2">Bio</p>
                    <TextArea
                        placeholder="Digite sua biografia"
                        rows={4}
                        value={newBio}
                        onChange={setNewBio}
                    />
                </label>
                <label>
                    <p className="text-lg text-gray-500 mb-2">Link</p>
                    <Input 
                        placeholder="Digite um link"
                        value={newLink}
                        onChange={setNewLink}
                    />
                </label>

                <Button 
                    label="Salvar alterações"
                    size={1}
                    onClick={editSave}
                />
            </section>
        </div>
    );
}