import { z } from "zod";

export const addTweetSchema = z.object({
    body: z.string({message: "O corpo do tweet é obrigatório"}).max(280, { message: "O tweet deve ter no máximo 280 caracteres" }),
    answer: z.string().optional()
});