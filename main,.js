const querystring = require('querystring');
const fetch = require('node-fetch');

app.get('/oauth2/redirect', async (req, res) => {
    const code = req.query.code;
    const data = {
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        grant_type: 'authorization_code',
        redirect_uri: 'YOUR_REDIRECT_URI',
        code: code,
        scope: 'identify'
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

    // ここでユーザーの情報を確認し、認証を完了します
    res.send(`Hello, ${user.username}! Your verification is complete.`);
});
