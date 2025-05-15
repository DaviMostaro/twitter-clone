import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getPublicURL } from "../utils/url";
import { checkIfFollows, findUserBySlug, follow, getUserFollowersCount, getUserFollowingCount, getUserTweetCount, unfollow, updateAvatarInfo, updateCoverInfo, updateUserInfo } from "../services/user";
import { prisma } from "../utils/prisma";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";
import { updateUserSchema } from "../schemas/update-schema";

export const getUser = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const { slug } = req.params;
    const user = await findUserBySlug(slug);
    if(!user) {
        return res.json({ error: "Usuário não encontrado" });
    }

    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const tweetCount = await getUserTweetCount(user.slug);

    res.json({ user, followingCount, followersCount, tweetCount });
}

export const getUserTweets = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const { slug } = req.params;

    const safeData = userTweetsSchema.safeParse(req.query);
    if(!safeData.success) {
        return res.status(400).json({ error: safeData.error });
    }

    let perPage = 10;
    let currentPage = safeData.data.page ?? 0;

    const tweets = await findTweetsByUser(slug, currentPage, perPage);

    res.json({ tweets, page: currentPage });
}

export const followToggle = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const { slug } = req.params;
    
    const me = req.userSlug as string; 

    const hasUserToBeFollowed = await findUserBySlug(slug);
    if(!hasUserToBeFollowed) {
        return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const follows = await checkIfFollows(me, slug);
    if(!follows) {
        await follow(me, slug);
        res.json({ followning: true });
    } else {
        await unfollow(me, slug);
        res.json({ followning: false });
    }
}

export const updateUser = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const safeData = updateUserSchema.safeParse(req.body);
    if(!safeData.success) {
        res.json({ errors: safeData.error.errors.map(error => error.message) });
        return;
    }

    await updateUserInfo(
        req.userSlug as string,
        safeData.data
    );

    res.json({});
}

export const updateAvatar = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const avatar = req.file?.filename;
    if(!avatar) {
        return res.status(400).json({ error: "Imagem não encontrada" });
    }

    await updateAvatarInfo(
        req.userSlug as string,
        avatar
    );
}

export const updateCover = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const cover = req.file?.filename;
    if(!cover) {
        return res.status(400).json({ error: "Imagem não encontrada" });
    }

    await updateCoverInfo(
        req.userSlug as string,
        cover
    );
}