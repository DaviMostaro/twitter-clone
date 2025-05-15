import { z } from "zod";

export const searchSchema = z.object({
    q: z.string({ message: "Preencha o campo de busca" }).min(3, { message: "A busca deve ter pelo menos 3 caracteres" }),
    page: z.coerce.number().optional(),
});