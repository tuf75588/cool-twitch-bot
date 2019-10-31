# Twitch Bot

A chat bot that works with multiple channels.

# Todo

* [ ] Model the data
* [ ] Setup backend
* [ ] Install tmi.js
* [ ] Add the bot to a channel
* [ ] Bot can read and respond to messages in specific channels


# Environment variable names

- TWITCH_CLIENT_ID - Client ID for the Twitch Application.
- TWITCH_CLIENT_SECRET - Client OAuth Secret for the Twitch Application
- TWITCH_CLIENT_REDIR_HOST - Base host for OAuth calls to Twitch
	(`/auth/twitch/callback`)

- We will be using OAuth Authorization Code Flow for this application
- Securely storing client secrets server => server.