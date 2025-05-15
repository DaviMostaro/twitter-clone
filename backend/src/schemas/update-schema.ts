import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }).max(20).optional(),
    bio: z.string().max(160, { message: "A biografia deve ter no máximo 160 caracteres" }).optional(),
    link: z.string().url({ message: "O link deve ser uma URL" }).optional()
});