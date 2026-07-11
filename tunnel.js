const localtunnel = require('localtunnel');

(async () => {
  console.log('Starting public tunnel to your local server on port 3000...');
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log(`\n🎉 Public URL: ${tunnel.url}`);
    console.log('Share this link with your clients/friends for feedback!');
    console.log('Keep this terminal open to keep the tunnel active. Press Ctrl+C to stop.');

    tunnel.on('close', () => {
      console.log('Tunnel closed.');
    });
  } catch (err) {
    console.error('Error starting tunnel:', err);
  }
})();
