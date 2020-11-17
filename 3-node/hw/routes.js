const handler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html lang="en">');
        res.write('<head><title>Greeting</title></head>');
        res.write('<body><h1>Hello there!</h1></body>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html lang="en">');
        res.write('<head><title>Enter message</title></head>');
        res.write('<body><ul><li>Dummy user #1</li><li>Dummy user #2</li><li>Dummy user #3</li></ul></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
        });
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
};

module.exports = handler;