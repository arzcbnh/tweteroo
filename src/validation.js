import joi from "joi";

const userSchema = joi.object({
    username: joi.string().required(),
    avatar: joi.string().uri().required(),
});

const tweetSchema = joi.object({
    username: joi.string().required(),
    tweet: joi.string().required(),
});

export function validateUser(user) {
    joi.attempt(user, userSchema, { abortEarly: false });
}

export function validateTweet(tweet) {
    joi.attempt(tweet, tweetSchema, { abortEarly: false });
}
