const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

async function readUsers() {
  try {
    const raw = await fs.readFile(usersFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(usersFile), { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = await readUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name: name || '', email, password: hash };
  users.push(user);
  await writeUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

module.exports = router;
