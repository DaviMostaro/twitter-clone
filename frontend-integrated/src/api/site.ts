import { req } from "@/api/axios";

type LoginResponse = {
    token: string;
    user: { id: string; name: string; email: string };
};

type CreateTweetResponse = {
    tweet: {
        id: number;
        userSlug: string;
        body: string;
        image: string | null;
        createdAt: string;
        answerOf: number | null;
    };
};

type TweetResponse = {
    tweet: {
        id: number;
        userSlug: string;
        body: string;
        image: string | null;
        createdAt: string;
        answerOf: number | null;
        user: { name: string; slug: string; avatar: string };
        likes: Array<object>;
    };
};

type TweetAnswersResponse = {
    answers: Array<{
        id: number;
        userSlug: string;
        body: string;
        image: string | null;
        createdAt: string;
        answerOf: number | null;
        user: { name: string; slug: string; avatar: string };
        likes: Array<object>;
    }>;
}

type UserTweetsResponse = {
    tweets: Array<{
        id: number;
        userSlug: string;
        body: string;
        image: string | null;
        createdAt: string;
        answerOf: number | null;
        likes: Array<object>;
    }>;
};

type FollowingResponse = {
    following: Array<{
      slug: string;
    }>;
}

type FeedResponse = {
    tweets: Array<{
        id: number;
        userSlug: string;
        body: string;
        image: string | null;
        createdAt: string;
        answerOf: number | null;
        user: { name: string; slug: string; avatar: string };
        likes: Array<object>;
    }>;
    page: number;
};

type SearchResponse = FeedResponse;

type TrendsResponse = {
    trends: Array<{ hashtag: string; counter: number }>;
};

type UserResponse = {
    user: {
        avatar: string;
        cover: string;
        slug: string;
        name: string;
        bio: string;
        link: string;
    };
    followingCount: number;
    followersCount: number;
    tweetCount: number;
};

type SuggestionsResponse = {
    users: Array<{ name: string; avatar: string; slug: string }>;
};

export const doLogin = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await req.post<LoginResponse>("/auth/signin", { email, password });
    return response.data;
};

export const doSignup = async (name: string, email: string, password: string): Promise<LoginResponse> => {
    const response = await req.post<LoginResponse>("/auth/signup", { name, email, password });
    return response.data;
};

export const getUser = async (slug: string, token: string): Promise<UserResponse> => {
    const response = await req.get<UserResponse>(`/user/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const postTweet = async (body: string, token: string, image?: File, answer?: number): Promise<CreateTweetResponse> => {
    const formData = new FormData();
    formData.append("body", body);
    if (image) {
        formData.append("image", image);
    }
    if (answer !== undefined && answer !== null) {
        formData.append("answer", String(answer));
    }

    const response = await req.post<CreateTweetResponse>(
        "/tweet",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
    );
    return response.data;
};

export const getTweet = async (id: number, token: string): Promise<TweetResponse> => {
    const response = await req.get<TweetResponse>(`/tweet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getTweetAnswers = async (id: number, token: string): Promise<TweetAnswersResponse> => {
    const response = await req.get<TweetAnswersResponse>(`/tweet/${id}/answers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const likeTweet = async (id: number, token: string): Promise<void> => {
    await req.post(`/tweet/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getUserTweets = async (slug: string, page: number, token: string): Promise<UserTweetsResponse> => {
    const response = await req.get<UserTweetsResponse>(`/user/${slug}/tweets?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const followUser = async (slug: string, token: string): Promise<{ following: boolean }> => {
    const response = await req.post<{ following: boolean }>(`/user/${slug}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getFollowing = async (slug: string, token: string): Promise<FollowingResponse> => {
    const response = await req.get<FollowingResponse>(`/user/${slug}/following`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateUser = async (token: string, name?: string, bio?: string, link?: string): Promise<any> => {
    const data: any = {};
    if (name?.trim()) data.name = name.trim();
    if (bio?.trim()) data.bio = bio.trim();
    if (link?.trim() && link.startsWith("http")) data.link = link.trim();

    const response = await req.put<any>(`/user`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
};

export const updateUserAvatar = async (avatar: File, token: string): Promise<void> => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    await req.put(`/user/avatar`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateUserCover = async (cover: File | undefined, token: string): Promise<void> => {
    const formData = new FormData();
    if (cover) {
        formData.append("cover", cover);
    }
    await req.put(`/user/cover`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getFeed = async (page: number, token: string): Promise<FeedResponse> => {
    const response = await req.get<FeedResponse>(`/feed?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const searchTweets = async (q: string, token: string, page?: number): Promise<SearchResponse> => {
    let url = `/search?q=${encodeURIComponent(q)}`;
    if (typeof page === "number") {
        url += `&page=${page}`;
    }
    const response = await req.get<SearchResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getTrends = async (token: string): Promise<TrendsResponse> => {
    const response = await req.get<TrendsResponse>(`/trending`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getSuggestions = async (token: string): Promise<SuggestionsResponse> => {
    const response = await req.get<SuggestionsResponse>(`/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
