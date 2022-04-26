import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
      const signature = req.get('X-Signature-Ed25519');
      const timestamp = req.get('X-Signature-Timestamp');

      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
      if (!isValidRequest) {
        res.status(401).send('Bad request signature');
        throw new Error('Bad request signature');
      }
    };
  };

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v9/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function getEmailJustSent(id) {
    const url = `https://api.buttondown.email/v1/emails/${id}`
    const res = await fetch(url, {
        headers: {
            Authorization: `Token ${process.env.BD_TOKEN}`
        }
    });
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }

    return res.json();
};

export async function sendMessageJustSent(subject, issueNumber, url) {
    const endpoint = `channels/${process.env.CHANNEL_ID}/messages`;

    DiscordRequest(endpoint, {
        method: 'POST',
        body: {
            content: `**${subject}**\nIssue ${issueNumber} of Until It's Not Fun is out now! Read it at ${url}.`
        }
    })
}