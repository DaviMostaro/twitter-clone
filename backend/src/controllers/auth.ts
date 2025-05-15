import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";

export const signup: RequestHandler = async (req, res) => {
    const safeData = signupSchema.safeParse(req.body);
    if(!safeData.success) {
        res.json({ errors: safeData.error.errors.map(error => error.message) });
        return;
    }
    // verificar email
    const hasEmail = await findUserByEmail(safeData.data.email);
    if(hasEmail) {
        res.json({ errors: ["Email já cadastrado"] });
        return;
    }

    // verificar slug
    let genSlug = true;
    let userSlug = slug(safeData.data.name);
    while(genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if(hasSlug) {
            let slugSuffix = Math.floor(Math.random() * 999999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }

    // gerar hash de senha
    const hashPassword = await hash(safeData.data.password, 10);

    // criar usuário
    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword
    });

    // criar token
    const token = createJWT(userSlug);

    // retorna o resultado (token, user)

    res.status(201).json({
        token,
        user: {
            slug: newUser.slug,
            name: newUser.name,
            avatar: newUser.avatar
        }
    });
}

export const signin: RequestHandler = async (req, res) => {
    const safeData = signinSchema.safeParse(req.body);
    if(!safeData.success) {
        res.json({ errors: safeData.error.errors.map(error => error.message) });
        return;
    }

    const user = await findUserByEmail(safeData.data.email);
    if(!user) {
        res.status(401).json({ errors: ["Email ou senha inválidos"] });
        return;
    }

    const verifyPass = await compare(safeData.data.password, user.password);
    if(!verifyPass) {
        res.status(401).json({ errors: ["Email ou senha inválidos"] });
        return;
    }

    const token = createJWT(user.slug);
    res.status(200).json({
        token,
        user: {
            slug: user.slug,
            name: user.name,
            avatar: user.avatar
        }
    });
}