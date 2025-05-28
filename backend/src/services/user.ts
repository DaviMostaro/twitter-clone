
import { Prisma } from "../generated/prisma";
import { prisma } from "../utils/prisma"
import { getPublicURL } from "../utils/url";

export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: { email }
    });

    if(user) {
        return {
            ...user,
            avatar: getPublicURL(user.avatar),
            cover: getPublicURL(user.cover)
        }
    }

    return null;
}

export const findUserBySlug = async (slug: string) => {
    const user = await prisma.user.findFirst({
        select: {
            avatar: true,
            cover: true,
            slug: true,
            name: true,
            bio: true,
            link: true
        },
        where: { slug }
    });

    if(user) {
        return {
            ...user,
            avatar: getPublicURL(user.avatar),
            cover: getPublicURL(user.cover)
        }
    }

    return null;
}

export const createUser = async (data: Prisma.UserCreateInput) => {
    const newUser = await prisma.user.create({
        data
    });

    return {
        ...newUser,
        avatar: getPublicURL(newUser.avatar),
        cover: getPublicURL(newUser.cover)
    }
}

export const getUserFollowingCount = async (slug: string) => {
    const count = await prisma.follow.count({
        where: {user1Slug: slug}
    });

    return count;
}

export const getUserFollowersCount = async (slug: string) => {
    const count = await prisma.follow.count({
        where: {user2Slug: slug}
    });

    return count;
}

export const getUserTweetCount = async (slug: string) => {
    const count = await prisma.tweet.count({
        where: {userSlug: slug}
    });

    return count;
}

export const checkIfFollows = async (user1Slug: string, user2Slug: string) => {
    const follows = await prisma.follow.findFirst({
        where: {
            user1Slug,
            user2Slug
        }
    });

    return follows ? true : false;
}

export const follow = async (user1Slug: string, user2Slug: string) => {
    await prisma.follow.create({
        data: {
            user1Slug,
            user2Slug
        }
    });
}

export const unfollow = async (user1Slug: string, user2Slug: string) => {
    await prisma.follow.deleteMany({
        where: {
            user1Slug,
            user2Slug
        }
    });
}

export const updateUserInfo = async (slug: string, data: Prisma.UserUpdateInput) => {
    const user = await prisma.user.update({
        where: { slug },
        data,
        select: {
            name: true,
            bio: true,
            link: true,
            avatar: true,
            cover: true,
            slug: true,
        }
    });

    return user;
}

export const getUserFollowing = async (slug: string) => {
    const following = [];
    const reqFollow = await prisma.follow.findMany({
        where: { user1Slug: slug },
        select: {
            user2Slug: true
        }
    });

    for(let reqItem of reqFollow) {
        following.push(reqItem.user2Slug);
    }

    return following;
}

export const getUserSuggestions = async (slug: string) => {
    console.log("slug recebido:", slug);
    const following = await getUserFollowing(slug);
    console.log("following:", following);

    const followingPlusMe = [...following, slug];
    console.log("followingPlusMe:", followingPlusMe);

    type Suggestion = Pick<
        Prisma.UserGetPayload<Prisma.UserDefaultArgs>, 
        "name" | "avatar" | "slug"
    >;


    const slugs = followingPlusMe.map(s => `'${s}'`).join(", ");

    const suggestions: Suggestion[] = await prisma.$queryRawUnsafe(`
        SELECT
            name, avatar, slug
        FROM "User"
        WHERE 
            slug NOT IN (${slugs})
        ORDER BY RANDOM()
        LIMIT 2;
    `);

    for(let sugIndex in suggestions) {
        suggestions[sugIndex].avatar = getPublicURL(suggestions[sugIndex].avatar);
    }

    return suggestions;
}

export const updateAvatarInfo = async (slug: string, avatar: string) => {
    const user = await prisma.user.update({
        where: { slug },
        data: {
            avatar
        }
    });
}

export const updateCoverInfo = async (slug: string, cover: string) => {
    const user = await prisma.user.update({
        where: { slug },
        data: {
            cover
        }
    });
}
