export const DEMO_IDEAS = [
  {
    id: 1,
    title: 'AgriMind AI',
    description: 'AI-powered crop monitoring and yield prediction platform for small-scale farmers using satellite imagery and IoT sensors.',
    url: 'https://example.com/agrimind',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    member: 'Sarah Chen',
    date: '2026-05-18',
    featured: true,
    trending: true,
  },
  {
    id: 2,
    title: 'MedFlow Pro',
    description: 'Streamlined patient management system with AI triage, automated scheduling, and real-time health analytics dashboard.',
    url: 'https://example.com/medflow',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    member: 'James Wilson',
    date: '2026-05-15',
    featured: true,
    trending: false,
  },
  {
    id: 3,
    title: 'EduVerse VR',
    description: 'Immersive virtual reality classrooms for remote learning with interactive 3D models and real-time collaboration tools.',
    url: 'https://example.com/eduverse',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    member: 'Maria Garcia',
    date: '2026-05-20',
    featured: false,
    trending: true,
  },
  {
    id: 4,
    title: 'FinSight Analytics',
    description: 'Real-time financial market sentiment analysis using NLP on social media, news, and earnings calls for retail investors.',
    url: 'https://example.com/finsight',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    member: 'David Kim',
    date: '2026-05-12',
    featured: true,
    trending: false,
  },
  {
    id: 5,
    title: 'CodeSync IDE',
    description: 'Browser-based collaborative IDE with real-time pair programming, AI code review, and instant deployment pipelines.',
    url: 'https://example.com/codesync',
    category: 'Web Apps',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    member: 'Alex Rivera',
    date: '2026-05-19',
    featured: false,
    trending: true,
  },
  {
    id: 6,
    title: 'GreenRoute',
    description: 'Carbon footprint tracking app for logistics companies with route optimization to minimize environmental impact.',
    url: 'https://example.com/greenroute',
    category: 'Web Apps',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    member: 'Emma Thompson',
    date: '2026-05-10',
    featured: false,
    trending: false,
  },
];

export const CATEGORIES = ['All', 'AI', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'Web Apps'];
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const IDEAS_API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/ideas`;

export const isValidUrl = (value) => !value || /^https?:\/\/.+/.test(value);

export const createEmptyIdea = () => ({
  title: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  category: 'AI',
  image: '',
  member: '',
});

export const getIdeaLinks = (idea) => ({
  liveUrl: idea.liveUrl || idea.url || '',
  githubUrl: idea.githubUrl || '',
});