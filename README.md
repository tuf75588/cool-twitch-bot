# Twitch Bot

A chat bot that works with multiple channels.

# Todo

* [x] Model the data
* [x] Setup backend
* [x] Install tmi.js
* [x] Add the bot to a channel
* [x] Bot can read and respond to messages in specific channels


## Environment variable names
- TWITCH_CLIENT_ID - Client ID for the Twitch Application.
- TWITCH_CLIENT_SECRET - Client OAuth Secret for the Twitch Application
- TWITCH_CLIENT_REDIR_HOST - Base host for OAuth calls to Twitch
- MONGO_HOST - Hostname for MongoDB(localhost for development)
- MONGO_DBNAME - Mongo Database name
- MONGO_USER - MongoDB username
- MONGO_PASS - MongoDB password
- JWT_SECRET - jsonwebtoken Secret
	(`/auth/twitch/callback`)


### OAuth Flow
- We will be using OAuth Authorization Code Flow for this application
- Securely storing client secrets server => server.

example request:
http://localhost:8000/auth/twitch?scope=chat:edit+chat:read+whispers:read