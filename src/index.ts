require('dotenv').config()
import TwitterApi from 'twitter-api-v2';
export * from "./bot";


const start = async () => {
    // OAuth 1.0a (User context)
    const userClient = new TwitterApi({
        appKey: process.env.api_key as string,
        appSecret: process.env.api_key_secret as string,
        // Following access tokens are not required if you are
        // at part 1 of user-auth process (ask for a request token)
        // or if you want a app-only client (see below)
        accessToken: process.env.access_token,
        accessSecret: process.env.access_token_secret,
    });


    await userClient.v2.tweet('Hello, this is a test.');
}

start();