import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";

export const findTweet = async (id: number) => {
    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    slug: true,
                    avatar: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { id }
    });

    if(tweet) {
        tweet.user.avatar = getPublicURL(tweet.user.avatar);
        if (tweet.image) {
            tweet.image = getPublicURL(tweet.image);
        }
        return tweet;
    }

    return null;
}

export const createTweet = async (userSlug: string, body: string, answer?: number, image?: string) => {
    const newTweet = await prisma.tweet.create({
        data: {
            userSlug,
            body,
            answerOf: answer ?? 0,
            image: image ?? null 
        }
    });

    return newTweet;
}

export const findAnswsersFromTweet = async (id: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    slug: true,
                    avatar: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { answerOf: id }
    });

    console.log("Tweets encontrados:", tweets);

    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicURL(tweets[tweetIndex].user.avatar);
        if (tweets[tweetIndex].image) {
            tweets[tweetIndex].image = getPublicURL(tweets[tweetIndex].image);
        }
    }

    return tweets;
}

export const checkIfTweetIsLikedByUser = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.findFirst({
        where: {
            tweetId: id,
            userSlug: slug
        }
    });

    return isLiked ? true : false;
}

export const unlikeTweet = async (slug: string, id: number) => {
    const unlike = await prisma.tweetLike.deleteMany({
        where: {
            userSlug: slug,
            tweetId: id
        }
    });
}

export const likeTweet = async (slug: string, id: number) => {
    const like = await prisma.tweetLike.create({
        data: {
            userSlug: slug,
            tweetId: id
        }
    });
}

export const findTweetsByUser = async (slug: string, currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { userSlug: slug, answerOf: 0 },
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage
    });

    for (let tweetIndex in tweets) {
        if (tweets[tweetIndex].image) {
            tweets[tweetIndex].image = getPublicURL(tweets[tweetIndex].image);
        }
    }

    return tweets;
}

export const findTweetFeed = async (following: string[], currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    slug: true,
                    avatar: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            userSlug: { in: following },
            answerOf: 0
        },
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage
    });

    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicURL(tweets[tweetIndex].user.avatar);
        if (tweets[tweetIndex].image) {
            tweets[tweetIndex].image = getPublicURL(tweets[tweetIndex].image);
        }
    }

    return tweets;
}

export const findTweetsByBody = async (bodyContains: string, currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    slug: true,
                    avatar: true,
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { 
            body: { 
                contains: bodyContains, 
                mode: "insensitive" 
            },
            answerOf: 0
        },
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage
    });

    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicURL(tweets[tweetIndex].user.avatar);
        if (tweets[tweetIndex].image) {
            tweets[tweetIndex].image = getPublicURL(tweets[tweetIndex].image);
        }
    }

    return tweets;
}