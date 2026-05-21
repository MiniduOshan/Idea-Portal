import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Idea from './models/Idea.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI?.trim() || process.env.MONGO_URI?.trim();

const DEMO_IDEAS = [
  {
    title: 'AgriMind AI',
    description: 'AI-powered crop monitoring and yield prediction platform for small-scale farmers using satellite imagery and IoT sensors.',
    url: 'https://example.com/agrimind',
    liveUrl: 'https://example.com/agrimind',
    githubUrl: 'https://github.com/fishifox/agrimind-ai',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    member: 'Sarah Chen',
    date: '2026-05-18',
    featured: true,
    trending: true,
  },
  {
    title: 'MedFlow Pro',
    description: 'Streamlined patient management system with AI triage, automated scheduling, and real-time health analytics dashboard.',
    url: 'https://example.com/medflow',
    liveUrl: 'https://example.com/medflow',
    githubUrl: 'https://github.com/fishifox/medflow-pro',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    member: 'James Wilson',
    date: '2026-05-15',
    featured: true,
    trending: false,
  },
  {
    title: 'EduVerse VR',
    description: 'Immersive virtual reality classrooms for remote learning with interactive 3D models and real-time collaboration tools.',
    url: '',
    liveUrl: '',
    githubUrl: 'https://github.com/fishifox/eduverse-vr',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    member: 'Maria Garcia',
    date: '2026-05-20',
    featured: false,
    trending: true,
  },
  {
    title: 'FinSight Analytics',
    description: 'Real-time financial market sentiment analysis using NLP on social media, news, and earnings calls for retail investors.',
    url: 'https://example.com/finsight',
    liveUrl: 'https://example.com/finsight',
    githubUrl: 'https://github.com/fishifox/finsight-analytics',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    member: 'David Kim',
    date: '2026-05-12',
    featured: true,
    trending: false,
  },
  {
    title: 'CodeSync IDE',
    description: 'Browser-based collaborative IDE with real-time pair programming, AI code review, and instant deployment pipelines.',
    url: 'https://example.com/codesync',
    liveUrl: 'https://example.com/codesync',
    githubUrl: 'https://github.com/fishifox/codesync-ide',
    category: 'Web Apps',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    member: 'Alex Rivera',
    date: '2026-05-19',
    featured: false,
    trending: true,
  },
  {
    title: 'GreenRoute',
    description: 'Carbon footprint tracking app for logistics companies with route optimization to minimize environmental impact.',
    url: '',
    liveUrl: '',
    githubUrl: 'https://github.com/fishifox/greenroute',
    category: 'Web Apps',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    member: 'Emma Thompson',
    date: '2026-05-10',
    featured: false,
    trending: false,
  },
];

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const validateEmail = (email) => {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+-]+@fishifox\.com$/.test(email);
};

const validateCreator = (idea, userEmail) => {
  if (!userEmail) return false;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && userEmail.trim().toLowerCase() === adminEmail) {
    return true;
  }
  if (idea.creatorEmail) {
    return idea.creatorEmail.trim().toLowerCase() === userEmail.trim().toLowerCase();
  }
  if (idea.member) {
    const username = userEmail.split('@')[0];
    const displayName = username
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return idea.member.trim().toLowerCase() === displayName.trim().toLowerCase();
  }
  return false;
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  if (!storedPassword || !storedPassword.includes(':')) return false;
  const [salt, hash] = storedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

app.post('/api/auth/register', async (request, response) => {
  try {
    const { email, password } = request.body ?? {};
    if (!validateEmail(email)) {
      return response.status(400).json({ message: 'Please use a valid FishiFox email (e.g. name@fishifox.com)' });
    }
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && email.trim().toLowerCase() === adminEmail) {
      return response.status(400).json({ message: 'This email address is reserved.' });
    }
    if (!password || password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return response.status(400).json({ message: 'This email is already registered.' });
    }

    const hashedPassword = hashPassword(password);
    await User.create({
      email: email.toLowerCase(),
      password: hashedPassword
    });

    return response.status(201).json({ message: 'User registered successfully', email: email.toLowerCase() });
  } catch (error) {
    return response.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (request, response) => {
  try {
    const { email, password } = request.body ?? {};
    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required' });
    }


    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    return response.json({ message: 'Login successful', email: user.email });
  } catch (error) {
    return response.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/ideas', async (_request, response) => {
  try {
    const ideas = await Idea.find().sort({ date: -1, createdAt: -1 });
    response.json(ideas);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch ideas', error: error.message });
  }
});

app.post('/api/ideas', async (request, response) => {
  try {
    const userEmail = request.headers['x-user-email'];
    if (!validateEmail(userEmail)) {
      return response.status(401).json({ message: 'Unauthorized: Invalid or missing FishiFox email.' });
    }

    const { title, description, url, liveUrl, githubUrl, category, image, member } = request.body ?? {};

    if (!title || !description || !category || !member) {
      return response.status(400).json({ message: 'title, description, category, and member are required' });
    }

    const idea = await Idea.create({
      title,
      description,
      url: url || liveUrl || '',
      liveUrl: liveUrl || url || '',
      githubUrl: githubUrl || '',
      category,
      image: image || '',
      member,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      trending: false,
      creatorEmail: userEmail.toLowerCase(),
    });

    return response.status(201).json(idea);
  } catch (error) {
    return response.status(400).json({ message: 'Failed to create idea', error: error.message });
  }
});

app.put('/api/ideas/:id', async (request, response) => {
  try {
    const userEmail = request.headers['x-user-email'];
    if (!validateEmail(userEmail)) {
      return response.status(401).json({ message: 'Unauthorized: Invalid or missing FishiFox email.' });
    }

    const { id } = request.params;
    const { title, description, url, liveUrl, githubUrl, category, image, member } = request.body ?? {};

    if (!title || !description || !category || !member) {
      return response.status(400).json({ message: 'title, description, category, and member are required' });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return response.status(404).json({ message: 'Idea not found' });
    }

    if (!validateCreator(idea, userEmail)) {
      return response.status(403).json({ message: 'You are not authorized to edit this project' });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      {
        title,
        description,
        url: url || liveUrl || '',
        liveUrl: liveUrl || url || '',
        githubUrl: githubUrl || '',
        category,
        image: image || '',
        member,
        creatorEmail: idea.creatorEmail ? idea.creatorEmail.toLowerCase() : userEmail.toLowerCase(),
      },
      { new: true }
    );

    return response.json(updatedIdea);
  } catch (error) {
    return response.status(400).json({ message: 'Failed to update idea', error: error.message });
  }
});

app.delete('/api/ideas/:id', async (request, response) => {
  try {
    const userEmail = request.headers['x-user-email'];
    if (!validateEmail(userEmail)) {
      return response.status(401).json({ message: 'Unauthorized: Invalid or missing FishiFox email.' });
    }

    const { id } = request.params;
    const idea = await Idea.findById(id);
    if (!idea) {
      return response.status(404).json({ message: 'Idea not found' });
    }

    if (!validateCreator(idea, userEmail)) {
      return response.status(403).json({ message: 'You are not authorized to delete this project' });
    }

    await Idea.findByIdAndDelete(id);
    return response.json({ message: 'Idea deleted successfully', id });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to delete idea', error: error.message });
  }
});

async function seedIdeas() {
  const ideaCount = await Idea.countDocuments();
  if (ideaCount === 0) {
    await Idea.insertMany(DEMO_IDEAS);
  }
}

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD environment variables not set. Skipping admin user seeding.');
    return;
  }

  const adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!adminUser) {
    const hashedPassword = hashPassword(adminPassword);
    await User.create({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
    });
    console.log(`Seeded admin user ${adminEmail}`);
  }
}

async function startServer() {
  if (!mongoUri) {
    throw new Error('Set MONGODB_URI or MONGO_URI in backend/.env before starting the server.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  await seedIdeas();
  await seedAdminUser();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});