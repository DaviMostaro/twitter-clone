import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { checkIfTweetIsLikedByUser, createTweet, findAnswsersFromTweet, findTweet, likeTweet, unlikeTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response): Promise<any> => {
    
    console.log("BODY:", req.body, "FILE:", req.file);

    const safeData = addTweetSchema.safeParse(req.body);
    if(!safeData.success) {
        res.json({ errors: safeData.error.errors.map(error => error.message) });
        return;
    }

    if(safeData.data.answer) {
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
        if(!hasAnswerTweet) {
            return res.json({ error: "Tweet não encontrado" });
        }
    }

    let imagePath = "";
    if (req.file) {
        imagePath = req.file.filename; 
    }

    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0,
        imagePath
    );

    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
    if(hashtags) {
        for(let hashtag of hashtags) {
            if(hashtag.length >= 2) {
                await addHashtag(hashtag);
            }
        }
    }

    res.json({ tweet: newTweet });
}

export const getTweet = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const tweetId = parseInt(req.params.id);
    const tweet = await findTweet(tweetId);
    if(!tweet) {
        return res.json({ error: "Tweet não encontrado" });
    }

    res.json({ tweet });
}

export const getAnswers = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    
    const answers = await findAnswsersFromTweet(parseInt(id));

    res.json({ answers });
}

export const likeToggle = async (req: ExtendedRequest, res: Response): Promise<any> => {
    const { id } = req.params;
    
    const liked = await checkIfTweetIsLikedByUser(req.userSlug as string, parseInt(id));

    if(liked) {
        unlikeTweet(req.userSlug as string, parseInt(id));
    } else {
        likeTweet(req.userSlug as string, parseInt(id));
    }

    res.json({});
}