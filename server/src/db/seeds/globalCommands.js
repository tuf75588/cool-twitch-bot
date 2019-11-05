module.exports = [
  {
    name: 'uptime',
    aliases: [],
    replyText: 'The stream uptime is: {{stream_uptime}}',
    requiredRole: 'viewer',
  },
  {
    name: 'following',
    aliases: [],
    replyText: '@{{user}}, you followed {{user_following}} ago',
    requiredRole: 'viewer',
  },
  {
    name: 'settitle',
    aliases: [],
    replyText: '',
    requiredRole: 'manager',
  },
  {
    name: 'setgame',
    aliases: ['setcategory', 'setdirectory', 'setplaying'],
    replyText: '',
    requiredRole: 'manager',
  },
];
