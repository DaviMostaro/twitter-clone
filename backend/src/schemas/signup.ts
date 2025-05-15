import { z } from "zod";

export const signupSchema = z.object({
    name: z.string({message: "Preencha seu nome"}).min(2, {message: "Ser nome deve ter pelo menos 2 caracteres"}),
    email: z.string({message: "Preencha seu email"}).email({message: "E-mail inválido"}),
    password: z.string({message: "Preencha sua senha"}).min(4, {message: "Sua senha deve ter pelo menos 4 caracteres"}),
});