const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/oauth2/redirect', async (req, res) => {
    const code = req.query.code;
    const data = {
        client_id: '1271274171762086023',
        client_secret: 'egTVnjm4KboPwFqi5o5oVVA9I_oia10Q',
        grant_type: 'authorization_code',
        redirect_uri: 'YOUR_REDIRECT_URI',
        code: code,
        scope: 'identify guilds'
    };

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: querystring.stringify(data)
    });

    const json = await response.json();
    const userInfo = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${json.token_type} ${json.access_token}`
        }
    });
    const user = await userInfo.json();

    // Handle role assignment
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
    client.once('ready', async () => {
        const guild = client.guilds.cache.get('YOUR_GUILD_ID');
        const member = await guild.members.fetch(user.id);

        // Add the role to the user
        const role = guild.roles.cache.find(role => role.name === 'YOUR_ROLE_NAME');
        if (role && !member.roles.cache.has(role.id)) {
            await member.roles.add(role);
        }

        // Respond to the user
        res.send(`<html><body><h1>Verification Complete</h1><p>You have been successfully verified!</p><img src="${user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : ''}" alt="User Icon"></body></html>`);
    });
    client.login('YOUR_BOT_TOKEN');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
