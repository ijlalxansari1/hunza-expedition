import { createInterface } from 'node:readline/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getPayload } from 'payload';

function readHidden(prompt: string): Promise<string> {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    return Promise.reject(new Error('Run this command from an interactive terminal.'));
  }

  return new Promise((resolveInput, rejectInput) => {
    const characters: string[] = [];
    const restoreTerminal = () => {
      input.off('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
    };

    const onData = (chunk: Buffer) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          restoreTerminal();
          rejectInput(new Error('Password reset cancelled.'));
          return;
        }

        if (character === '\r' || character === '\n') {
          restoreTerminal();
          resolveInput(characters.join(''));
          return;
        }

        if (character === '\u0008' || character === '\u007f') {
          characters.pop();
        } else if (character >= ' ' && character !== '\u007f') {
          characters.push(character);
        }
      }
    };

    process.stdout.write(prompt);
    input.setEncoding('utf8');
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

let payload: Awaited<ReturnType<typeof getPayload>> | undefined;
let password = '';
let confirmation = '';

try {
  const configPath = pathToFileURL(resolve(process.cwd(), 'payload.config.ts')).href;
  const { default: config } = await import(configPath);
  payload = await getPayload({ config });

  const readline = createInterface({ input: process.stdin, output: process.stdout });
  const email = (await readline.question('Existing admin email: ')).trim().toLowerCase();
  readline.close();

  if (!email.includes('@')) {
    throw new Error('Enter a valid admin email address.');
  }

  password = await readHidden('New password (12+ characters; input hidden): ');
  confirmation = await readHidden('Confirm new password: ');

  if (password.length < 12) {
    throw new Error('Choose a password with at least 12 characters.');
  }
  if (password !== confirmation) {
    throw new Error('The passwords do not match.');
  }

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 2,
    depth: 0,
    overrideAccess: true,
  });

  if (docs.length !== 1) {
    throw new Error(docs.length === 0
      ? 'No account was found for that email.'
      : 'More than one account matched that email; no password was changed.');
  }
  if (docs[0].role !== 'admin') {
    throw new Error('That account is not an administrator; no password was changed.');
  }

  await payload.update({
    collection: 'users',
    id: docs[0].id,
    data: { password },
    depth: 0,
    overrideAccess: true,
  });

  console.log('Admin password updated. Sign in at /admin with that email and the new password.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Admin password reset failed.');
  process.exitCode = 1;
} finally {
  password = '';
  confirmation = '';
  if (payload) {
    await payload.destroy();
  }
}
