export const getPublicURL = (url: string) => {
    return `${process.env.BASE_URL}/${url}`;
}