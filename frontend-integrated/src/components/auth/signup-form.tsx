"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as api from "@/api/site";

export const SignupForm = () => {
    const router = useRouter();
    const [nameField, setNameField] = useState("");
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");

    const handleEnterButton = async () => {
        if (nameField === "" || emailField === "" || passwordField === "") {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const user = await api.doSignup(nameField, emailField, passwordField);
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
            console.log(error);
            alert("Erro ao efetuar cadastro");
            return;
        }
    };

    return (
        <>
            <Input
                placeholder="Digite seu nome"
                value={nameField}
                onChange={(t) => setNameField(t)}
            />

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
                label="Criar conta" 
                onClick={handleEnterButton}
                size={1}
            />
        </>
    );
}