import dotenv from 'dotenv/config';
import express from 'express';
import {
  getEmailJustSent,
  sendMessageJustSent,
  VerifyDiscordRequest
 } from './utils.js';
import {
  TEST_COMMAND,
  HasGuildCommands,
  LATEST_COMMAND
} from "./commands.js";
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';

const app = express();

app.use('/interactions', express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.use('/webhooks', express.json());

app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  };

  /**
   * Handle slash command requests
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Hello World!',
        },
      });
    } else if (name === 'latest') {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Hardcoding URL in for now
            content: "https://untilitsnotfun.com/posts/2022-04-22"
          },
        });
    }
  }
});

// Handle webhooks sent from Buttondown
app.post('/webhooks', async function (req, res) {
  const emailId = req.body.data.email;

  const email = await getEmailJustSent(emailId);

  const subject = email.subject;
  const issueNumber = email.secondary_id;

  // Hardcoding URL in for now
  sendMessageJustSent(subject, issueNumber, 'https://untilitsnotfun.com/posts/2022-04-29')

  return res.end()
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    LATEST_COMMAND
  ]);
});