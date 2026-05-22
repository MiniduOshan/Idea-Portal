export const DEMO_IDEAS = [];


export const CATEGORIES = ['All', 'AI', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'Web Apps'];
export const STATUSES = ['Requirements Phase', 'In Progress (Working)', 'Testing Phase', 'Completed (Launched)'];
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const IDEAS_API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/ideas`;

export const DEFAULT_NO_LIVE_URL_IMAGE = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80'; // Website design/template workspace
export const DEFAULT_LIVE_URL_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'; // Tech/web dashboard
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80'; // Gradient fallback

export const getProjectImage = (idea, imageError = false) => {
  if (imageError) {
    return (idea?.liveUrl || idea?.url) ? DEFAULT_LIVE_URL_IMAGE : DEFAULT_NO_LIVE_URL_IMAGE;
  }
  if (!idea?.image) {
    const liveUrl = idea?.liveUrl || idea?.url;
    if (liveUrl) {
      return `https://s0.wp.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=800`;
    }
    return DEFAULT_NO_LIVE_URL_IMAGE;
  }
  return idea.image;
};

export const isValidUrl = (value) => !value || /^https?:\/\/.+/.test(value);

export const createEmptyIdea = () => ({
  title: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  category: 'AI',
  image: '',
  member: '',
  status: 'Requirements Phase',
  collaborators: [],
});

export const getIdeaLinks = (idea) => ({
  liveUrl: idea.liveUrl || idea.url || '',
  githubUrl: idea.githubUrl || '',
});