import https from 'node:https';

https.get('https://paginarocket.netlify.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const scriptMatch = data.match(/src="(\/assets\/[^"]+)"/);
    console.log('Script tag on Netlify:', scriptMatch ? scriptMatch[1] : 'No script match');
    if (scriptMatch) {
      https.get('https://paginarocket.netlify.app' + scriptMatch[1], (sRes) => {
        console.log('Script status on Netlify:', sRes.statusCode);
      });
    }
  });
}).on('error', e => console.error(e));
