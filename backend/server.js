import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Idea from './models/Idea.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const DEMO_IDEAS = [
  {
    title: 'AgriMind AI',
    description: 'AI-powered crop monitoring and yield prediction platform for small-scale farmers using satellite imagery and IoT sensors.',
    url: 'https://example.com/agrimind',
    liveUrl: 'https://example.com/agrimind',
    githubUrl: 'https://github.com/fishifox/agrimind-ai',
    forkUrl: 'https://github.com/fishifox/agrimind-ai/fork',
    issueUrl: 'https://github.com/fishifox/agrimind-ai/issues',
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
    forkUrl: 'https://github.com/fishifox/medflow-pro/fork',
    issueUrl: 'https://github.com/fishifox/medflow-pro/issues',
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
    forkUrl: 'https://github.com/fishifox/eduverse-vr/fork',
    issueUrl: 'https://github.com/fishifox/eduverse-vr/issues',
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
    forkUrl: '',
    issueUrl: 'https://github.com/fishifox/finsight-analytics/issues',
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
    forkUrl: 'https://github.com/fishifox/codesync-ide/fork',
    issueUrl: 'https://github.com/fishifox/codesync-ide/issues',
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
    forkUrl: '',
    issueUrl: '',
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
    const { title, description, url, liveUrl, githubUrl, forkUrl, issueUrl, category, image, member } = request.body ?? {};

    if (!title || !description || !category || !member) {
      return response.status(400).json({ message: 'title, description, category, and member are required' });
    }

    const idea = await Idea.create({
      title,
      description,
      url: url || liveUrl || '',
      liveUrl: liveUrl || url || '',
      githubUrl: githubUrl || '',
      forkUrl: forkUrl || '',
      issueUrl: issueUrl || '',
      category,
      image: image || '',
      member,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      trending: false,
    });

    return response.status(201).json(idea);
  } catch (error) {
    return response.status(400).json({ message: 'Failed to create idea', error: error.message });
  }
});

async function seedIdeas() {
  const ideaCount = await Idea.countDocuments();
  if (ideaCount === 0) {
    await Idea.insertMany(DEMO_IDEAS);
  }
}

async function startServer() {
  if (!mongoUri) {
    throw new Error('Set MONGODB_URI or MONGO_URI in backend/.env before starting the server.');
  }

  await mongoose.connect(mongoUri);
  await seedIdeas();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});