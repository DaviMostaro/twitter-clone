import { Response } from "express";
import { feedSchema } from "../schemas/feed";
import { ExtendedRequest } from "../types/extended-request";
import { getUserFollowing } from "../services/user";
import { findTweetFeed } from "../services/tweet";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
    const safeData = feedSchema.safeParse(req.query);
    if(!safeData.success) {
        res.json({ errors: safeData.error.errors.map(error => error.message) });
        return;
    }

    let perPage = 10;
    let currentPage = safeData.data.page ?? 0;

    const following = await getUserFollowing(req.userSlug as string);
    const tweets = await findTweetFeed(following, currentPage, perPage);

    res.json({ tweets, page: currentPage });
}