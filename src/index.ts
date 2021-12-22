require('dotenv').config()
import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
export * from "./bot";

const start = async () => {
    // OAuth 1.0a (User context)
    const writeClient = new TwitterApi({
        appKey: process.env.API_KEY as string,
        appSecret: process.env.API_KEY_SECRET as string,
        // Following access tokens are not required if you are
        // at part 1 of user-auth process (ask for a request token)
        // or if you want a app-only client (see below)
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
    });


    const userClient = new TwitterApi(process.env.BEARER_TOKEN as string);

    const repliedTweets: string[] = []

    const replyToUser = function(){

        return `
        Hey, below is a link to help you understand COVID-19 better:
        
        World Health Organization (WHO)
        -https://www.who.int/health-topics/coronavirus#tab=tab_1
        `
    }

    // delete rules; rules must be deleted expicitly via id["string"] when not in use
    const deleteRules = await userClient.v2.updateStreamRules({
        delete: {
            // deleted rules; tools and greetings rules (test rules)
            ids : [
                '1473412134755205121', 
                '1473375518535741441', 
                '1473375518535741441',
                '1473412134755205121',
                '1473412734851026944',
                '1473419267345313798',
                '1473420793442750465',
                '1473448045043798016', 
                '1473450211477364742',
                '1473452624112328704',
            ],
        },
    })

    // add rules
    const addedRules = await userClient.v2.updateStreamRules({
        add: [
            { 
                value: '"covid is fake" OR "covid is a hoax" OR "omicronn is a flu" lang:en', 
                tag: 'rule #1',
            },
            {
                value: '#covidisflu OR #covidisfake OR  #covidhoax lang:en',
                tag: 'rule #2'
            }
        ],
    });

    // console log current rules
    const rules = await userClient.v2.streamRules();
    console.log(rules.data.map( rules => rules.id ));



    const stream = await userClient.v2.searchStream();

// Awaits for a tweet
    stream.on(
        // Emitted when Node.js {response} emits a 'error' event (contains its payload).
        ETwitterStreamEvent.ConnectionError,
        err => console.log('Connection error!', err),
    );

    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.'),
    );

    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        eventData => 
            console.log('Twitter has sent something:', eventData),
    );

    stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
    );

    stream.on(
        ETwitterStreamEvent.Data,
        async e => {
            if(!(e.data.id in repliedTweets)){
                await writeClient.v2.reply(
                    replyToUser(),
                    e.data.id
                )
                repliedTweets.push(e.data.id)
            }
        }
    );

    // Enable reconnect feature
    stream.autoReconnect = true;

    // Be sure to close the stream where you don't want to consume data anymore from it
    // stream.close();

    // -- Alternative usage --

    // You can also use async iterator to iterate over tweets!
    // for await (const { data } of stream) {
    // console.log('This is my tweet:', data);
    // }

    // await userClient.v2.tweet('Hello, this is a test. #2');
}

start();