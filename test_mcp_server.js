const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const globalModules = require('child_process').execSync('npm root -g').toString().trim();
const pkgDir = path.join(globalModules, '@postman', 'postman-mcp-server');
const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
const serverPath = path.join(pkgDir, pkgJson.main || pkgJson.bin);

console.log('Server path:', serverPath);

const server = spawn(process.execPath, [serverPath, '--full'], {
  env: { ...process.env, POSTMAN_API_KEY: 'DUMMY_KEY' }
});

let stdoutBuffer = '';
let stderrBuffer = '';

server.stdout.on('data', (data) => {
  const text = data.toString();
  stdoutBuffer += text;
  const lines = stdoutBuffer.split('\n');
  stdoutBuffer = lines.pop();
  lines.forEach(line => {
    if (!line.trim()) return;
    console.log('STDOUT:', line);
    try {
      const msg = JSON.parse(line);
      console.log('PARSED:', JSON.stringify(msg, null, 2));
    } catch (e) {
      // Not JSON
    }
  });
});

server.stderr.on('data', (data) => {
  const text = data.toString();
  stderrBuffer += text;
  const lines = stderrBuffer.split('\n');
  stderrBuffer = lines.pop();
  lines.forEach(line => {
    if (line.trim()) console.error('STDERR:', line);
  });
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

server.on('exit', (code) => {
  console.log('SERVER EXITED with code:', code);
});

function send(msg) {
  const str = JSON.stringify(msg) + '\n';
  console.log('SENDING:', str.trim());
  server.stdin.write(str);
}

setTimeout(() => send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test-client', version: '1.0.0' } } }), 2000);
setTimeout(() => send({ jsonrpc: '2.0', method: 'notifications/initialized' }), 4000);
setTimeout(() => send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }), 6000);
setTimeout(() => {
  console.log('\n--- Time limit reached, shutting down ---');
  console.log('Remaining stdout buffer:', stdoutBuffer);
  console.log('Remaining stderr buffer:', stderrBuffer);
  server.kill();
  process.exit(0);
}, 25000);

