import { z } from "zod";

export const signinSchema = z.object({
    email: z.string({message: "Preencha seu email"}).email({message: "E-mail inválido"}),
    password: z.string({message: "Preencha sua senha"}).min(4, {message: "Sua senha deve ter pelo menos 4 caracteres"}),
});