import { DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      // if (!installedNames.includes(command['name'])) {
        if (true) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed, updating`);
        // UpdateGuildCommand(appId, guildId, command);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function UpdateGuildCommand(appId, guildId, command) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${command['id']}`
  console.log(command['id'])
  try {
    await DiscordRequest(endpoint, { method: 'PATCH', body: command});
  } catch (err) {
    console.error(err);
  }
}

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  id: 'test',
  description: 'Basic guild command',
  type: 1,
};

export const LATEST_COMMAND = {
    name: 'latest',
    id: 'latest',
    description: 'Get link to latest newsletter post',
    type: 1,
    options: [{
      name: 'column',
      description: 'Optionally get a specific column',
      type: 3,
      required: false,
      choices: [
        {
          name: 'Popcorn and a Coke',
          value: '#popcorn-and-a-coke'
        },
        {
          name: 'Tech Shelf',
          value: '#the-tech-shelf'
        },
        {
          name: 'What We Like',
          value: '#what-we-like-this-week'
        }
      ]
    }]
};
