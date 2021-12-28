require('dotenv').config()
import { resolve } from 'path/posix';
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

    // ID's of replied tweets users will be stored here so the bot doesn't reply twice
    const repliedTweets: string[] = []


    // function consisting of an array of different replies to tweets
    // returns a randomized reply from array
    const replyToUser = function(){

        let replies = [ 
        `Hey, below is a link to help you understand COVID-19 better:
        World Health Organization (WHO)
        https://www.who.int/health-topics/coronavirus#tab=tab_1`,

        `Here is some info about COVID-19:
        Center for Disease and Prevention
        https://www.cdc.gov/coronavirus/2019-ncov/index.html`,

        `Hello, you can better understand COVID-19 at:
        World Health Organization (WHO)
        https://www.who.int/health-topics/coronavirus#tab=tab_1`,

        `Here is some info about COVID-19:
        Center for Disease and Prevention
        https://www.cdc.gov/coronavirus/2019-ncov/index.html`,

        `You can understand COVID-19 better at:
        World Health Organization (WHO)
        https://www.who.int/health-topics/coronavirus#tab=tab_1`,

        `Here is some info about COVID-19:
        Center for Disease and Prevention
        https://www.cdc.gov/coronavirus/2019-ncov/index.html`
        ]

        // randomizes replies
        const randomElement = replies[Math.floor(Math.random() * replies.length)];

        return randomElement

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
                '1474157307151806465', 
                '1473462014060101633', 
                '1473454228521717760',
                '1473462632808009730',
                '1475157896467865605',
            ],
        },
    })

    // add rules
    const addedRules = await userClient.v2.updateStreamRules({
        add: [
            { 
                value: '-retweets_of:CovidisReal01 -is:reply "covid is fake" OR "covid is a hoax" OR "omicronn is a flu" lang:en', 
                tag: 'rule #1 new',
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
        // Emitted when a Twitter payload has to be replied 
        ETwitterStreamEvent.Data,
        async e => {

            // replyTimer is an async function which replies to noticed tweets and and pushes
            async function replyTimer() { 
                if(!(e.data.id in repliedTweets)){

                    await writeClient.v2.reply(
                        replyToUser(),
                        e.data.id
                    )
                repliedTweets.push(e.data.id)}
            }

            // timer to wait 5 seconds using Promise.resolve()
            await new Promise( () => {
                setTimeout(replyTimer, 30000)
            })
            
        }
    );

    // Enable reconnect feature
    stream.autoReconnect = true;

    // Be sure to close the stream where you don't want to consume data anymore from it
    // stream.close();
}

try {
    start();
} catch (error) {
    
}
