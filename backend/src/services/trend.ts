import { prisma } from "../utils/prisma"

export const addHashtag = async (hashtag: string) => {
    const hs = await prisma.trend.findFirst({
        where: {hashtag}
    });
    if(hs) {
        await prisma.trend.update({
            where: {id: hs.id},
            data: {counter: hs.counter + 1, updatedAt: new Date()}
        });
    } else {
        await prisma.trend.create({
            data: {hashtag}
        });
    }
}

export const getTrending = async () => {
    const trends = await prisma.trend.findMany({
        select: {
            hashtag: true,
            counter: true
        },
        orderBy: {counter: "desc"},
        take: 4
    });

    return trends;
}