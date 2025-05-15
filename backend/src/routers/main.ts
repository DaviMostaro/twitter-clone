import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from "../controllers/tweet";
import * as userController from "../controllers/user";
import * as feedController from "../controllers/feed";
import * as searchController from "../controllers/search";
import * as trendController from "../controllers/trend";
import * as suggestionController from "../controllers/suggestion";
import { verifyJWT } from "../utils/jwt";
import { upload } from "../utils/upload";


export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post('/auth/signup', authController.signup);
mainRouter.post('/auth/signin', authController.signin);

mainRouter.post('/tweet', verifyJWT, tweetController.addTweet);
mainRouter.get('/tweet/:id', verifyJWT, tweetController.getTweet);
mainRouter.get('/tweet/:id/answers', verifyJWT, tweetController.getAnswers);
mainRouter.post('/tweet/:id/like', verifyJWT, tweetController.likeToggle);

mainRouter.get('/user/:slug', verifyJWT, userController.getUser);
mainRouter.get('/user/:slug/tweets', verifyJWT, userController.getUserTweets);
mainRouter.post('/user/:slug/follow', verifyJWT, userController.followToggle);
mainRouter.put('/user', verifyJWT, userController.updateUser);
mainRouter.put('/user/avatar', verifyJWT, upload.single("avatar"), userController.updateAvatar);
mainRouter.put('/user/cover', verifyJWT, upload.single("cover"), userController.updateCover);

mainRouter.get('/feed', verifyJWT, feedController.getFeed);
mainRouter.get('/search', verifyJWT, searchController.searchTweets);
mainRouter.get('/trending', verifyJWT, trendController.getTrends);
mainRouter.get('/suggestions', verifyJWT, suggestionController.getSuggestions);

