import joi from "joi";

export const user = joi.object({
    username: joi.string().required(),
    avatar: joi.string().uri().required(),
});

export const tweet = joi.object({
    username: joi.string().required(),
    tweet: joi.string().required(),
});
