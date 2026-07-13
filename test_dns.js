const dns = require('dns').promises;
const nodemailer = require('nodemailer');

async function test() {
  try {
    const records = await dns.resolve4('smtp.gmail.com');
    const ipv4 = records[0];
    console.log('Resolved IPv4:', ipv4);

    const transporter = nodemailer.createTransport({
      host: ipv4,
      port: 465,
      secure: true,
      auth: { user: 'test@gmail.com', pass: 'dummy' },
      tls: {
        servername: 'smtp.gmail.com' // Crucial to pass certificate verification
      }
    });

    console.log('Transporter initialized to IP:', ipv4);
  } catch (err) {
    console.error(err);
  }
}
test();
