"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import * as api from "@/api/site";

export const SigninForm = () => {
    const router = useRouter();
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");

    const handleEnterButton = async () => {
        if (emailField === "" || passwordField === "") {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const user = await api.doLogin(emailField, passwordField);
            console.log(user);
            if (!user) {
                return;
            }
            localStorage.setItem("user", JSON.stringify({
                ...user.user,
                token: user.token
            }));
            router.replace("/home"); 
        }
        catch (error) {
            alert("Erro ao efetuar login");
            return;
        }       
    };

    return (
        <>
            <Input
                placeholder="Digite seu email"
                value={emailField}
                onChange={(t) => setEmailField(t)}
            />

            <Input
                placeholder="Digite sua senha"
                value={passwordField}
                onChange={(t) => setPasswordField(t)}
                password
            />

            <Button 
                label="Entrar" 
                onClick={handleEnterButton}
                size={1}
            />
        </>
    );
}