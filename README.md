# Twitter COVID-19 Awarness Bot

A Twitter bot that helps to stop misinformation on COVID-19 by replying to the keyword or phrase-specific tweets made by people in real time. By utilizing the Twitter API made for developers it listens to a stream of tweets through a set of rules which are defined in this code. Which help to parse tweets and targets those that deny Covid-19 and reply to them with links to correct information about Covid-19.

Technologies
------------

1. Node.js version 16.13.0
2. TypeScript support for Node.js version 17.0.1
3. npm-package: [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2/tree/c8dacc7c0f85bc45a41c678dfeee1ebde31dd451)


Roadmap
------------

Goal is to [fetch results of a filtered stream of tweets](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule#examples) and reply to results with a post through the bot.

Requirements
------------

* [A twitter developer account](https://developer.twitter.com/en/docs/platform-overview) is needed with required authentication to read and post tweets. 

* API: Twitter API v2

* Auth: You will need an [API key and secret as well as a BEARER token from Twitter API](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api) once you have signed up for a twitter developer account.

Useful commands
------------
* `npm run build` compile typescript to js
* `npm run start` compiles js code and deploys the bot

Improvements to be added
------------
* stream rules can be tweaked more for clearer tweet results
* make bot stop replying to itself
* re-tweet Covid-19 info to spread more awarness
* catch and resolve any errors encountered 