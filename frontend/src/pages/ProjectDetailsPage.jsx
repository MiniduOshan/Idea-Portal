import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AlertCircle, ChevronUp, Code2, Globe, GitBranch, Info, Sparkles, TrendingUp, Edit, Trash2, X, CheckCircle2 } from 'lucide-react';
import { loadIdeas, updateIdea, deleteIdea } from '../lib/ideasApi';
import { getIdeaLinks, CATEGORIES, createEmptyIdea, isValidUrl } from '../lib/portalData';

const getDisplayName = (email) => {
  if (!email) return '';
  const username = email.split('@')[0];
  return username
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isCreator = (idea, userEmail) => {
  if (!userEmail || !idea) return false;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && userEmail.trim().toLowerCase() === adminEmail) return true;
  if (idea.creatorEmail) {
    return idea.creatorEmail.trim().toLowerCase() === userEmail.trim().toLowerCase();
  }
  if (idea.member) {
    return idea.member.trim().toLowerCase() === getDisplayName(userEmail).trim().toLowerCase();
  }
  return false;
};

const IdeaCard = ({ idea, onOpenDetails }) => (
  <motion.div layout onClick={() => onOpenDetails?.(idea)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 cursor-pointer">
    <div className="relative h-48 overflow-hidden bg-slate-800">
      <img src={idea.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80'} alt={idea.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      {idea.trending && <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg"><TrendingUp className="w-3 h-3" />Trending</div>}
      {idea.featured && !idea.trending && <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-violet-500/90 text-white text-xs font-bold backdrop-blur-sm">Featured</div>}
    </div>

    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-violet-500/20 text-violet-300 border-violet-500/30">{idea.category}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors">{idea.title || 'Untitled Project'}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{idea.description || 'No description provided...'}</p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">{idea.member ? idea.member.charAt(0).toUpperCase() : '?'}</div>
          <div>
            <p className="text-sm font-medium text-slate-300">{idea.member || 'Anonymous'}</p>
            <p className="text-xs text-slate-500">{idea.date}</p>
          </div>
        </div>

        <div className="flex items-center">
          {idea.liveUrl ? (
            <motion.a
              href={idea.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
            >
              <Globe className="w-4 h-4" />
              Watch Live
            </motion.a>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500 font-medium">
              Not Deployed
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }} className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-emerald-500/90 backdrop-blur-sm text-white' : 'bg-red-500/90 backdrop-blur-sm text-white'}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

const EditModal = ({ isOpen, onClose, idea, onUpdate }) => {
  const [formData, setFormData] = useState(createEmptyIdea());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (idea) {
      setFormData(idea);
      setErrors({});
    }
  }, [idea]);

  if (!isOpen || !idea) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.member.trim()) newErrors.member = 'Member name is required';
    if (!isValidUrl(formData.liveUrl)) newErrors.liveUrl = 'Invalid URL format';
    if (!isValidUrl(formData.githubUrl)) newErrors.githubUrl = 'Invalid URL format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onUpdate({
      ...formData,
      liveUrl: formData.liveUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative my-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="w-6 h-6 text-violet-400" />
            Edit Idea Details
          </h3>
          <p className="text-sm text-slate-400 mt-1">Modify your project parameters below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border ${errors.title ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Short Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border ${errors.description ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none`} />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Live Site URL</label>
              <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border ${errors.liveUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all`} />
              {errors.liveUrl && <p className="mt-1 text-sm text-red-400">{errors.liveUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">GitHub URL</label>
              <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border ${errors.githubUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all`} />
              {errors.githubUrl && <p className="mt-1 text-sm text-red-400">{errors.githubUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail URL</label>
              <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Member Name</label>
            <input type="text" value={formData.member} onChange={(e) => setFormData({ ...formData, member: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border ${errors.member ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} />
            {errors.member && <p className="mt-1 text-sm text-red-400">{errors.member}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg hover:shadow-violet-500/30 transition-all cursor-pointer">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, idea, onConfirm }) => {
  if (!isOpen || !idea) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400 animate-pulse">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Delete Idea</h3>
          <p className="text-sm text-slate-400 mt-2">
            Are you sure you want to delete <span className="text-white font-semibold">"{idea.title}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              onConfirm(idea.id);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function ProjectDetailsPage() {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ideas, setIdeas] = useState(location.state?.ideas || []);

  const [userEmail, setUserEmail] = useState(localStorage.getItem('fishifox_user') || '');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const handleUpdateIdea = async (updatedIdea) => {
    try {
      const savedIdea = await updateIdea(updatedIdea.id, updatedIdea, userEmail);
      setIdeas((prev) => prev.map((item) => (item.id === savedIdea.id ? savedIdea : item)));
      setToast({ message: 'Idea updated successfully!', type: 'success' });
    } catch {
      setIdeas((prev) => prev.map((item) => (item.id === updatedIdea.id ? updatedIdea : item)));
      setToast({ message: 'Saved locally, but backend was unavailable.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteIdea(id, userEmail);
      setToast({ message: 'Idea deleted successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch {
      setToast({ message: 'Failed to delete idea from backend.', type: 'error' });
    }
  };

  useEffect(() => {
    if (ideas.length > 0) return;

    let isMounted = true;

    const loadPortalIdeas = async () => {
      const ideasFromServer = await loadIdeas();
      if (isMounted) {
        setIdeas(ideasFromServer);
      }
    };

    loadPortalIdeas();

    return () => {
      isMounted = false;
    };
  }, [ideas.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ideaId]);

  const idea = ideas.find((item) => String(item.id) === String(ideaId));

  if (ideas.length > 0 && !idea) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Project not found</p>
          <h1 className="mt-4 text-3xl font-bold">That idea is missing.</h1>
          <button type="button" onClick={() => navigate('/')} className="mt-6 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return <div className="min-h-screen bg-slate-950 text-white" />;
  }

  const links = getIdeaLinks(idea);
  const linkCount = [links.liveUrl, links.githubUrl].filter(Boolean).length;
  const deploymentStatus = links.liveUrl ? 'Deployed' : 'Not deployed yet';
  const relatedIdeas = ideas.filter((item) => item.id !== idea.id && item.category === idea.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
            All Projects
          </button>

          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 md:flex">
            <span>{idea.member || 'Anonymous'}</span>
            <span>/</span>
            <span className="text-white">{idea.title || 'Untitled Project'}</span>
          </div>

          <button type="button" onClick={() => navigate('/')} className="hidden sm:block rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
            Back to list
          </button>
        </div>
      </div>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-14">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">{idea.category}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">{deploymentStatus}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">{linkCount} links</span>
                {idea.featured && <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">Featured</span>}
                {idea.trending && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">Trending</span>}
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">Project Details</p>
                <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{idea.title || 'Untitled Project'}</h1>
                <p className="max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{idea.description || 'No description provided.'}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {links.liveUrl ? (
                  <a href={links.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-[1.01] cursor-pointer">
                    <Globe className="h-4 w-4" />
                    View Site
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/15 px-5 py-3 text-sm font-semibold text-slate-400">
                    <Globe className="h-4 w-4" />
                    Not deployed yet
                  </span>
                )}

                {links.githubUrl && (
                  <a href={links.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 cursor-pointer">
                    <GitBranch className="h-4 w-4" />
                    GitHub
                  </a>
                )}

                {isCreator(idea, userEmail) && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-violet-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeleteOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Project
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                <div className="relative h-64 sm:h-80">
                  <img src={idea.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80'} alt={idea.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/10">
                  {[
                    { label: 'Owner', value: idea.member || 'Anonymous' },
                    { label: 'Date', value: idea.date || '-' },
                    { label: 'Status', value: deploymentStatus },
                    { label: 'Links', value: String(linkCount) },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-950/95 p-4">
                      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                <Info className="h-4 w-4" />
                Overview
              </div>
              <p className="text-sm leading-relaxed text-slate-300">This is the project detail view for {idea.title || 'this project'}. It keeps your portal theme, but presents the project like a dedicated repository page with quick actions, deployment status, and linked resources.</p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Deployment', value: links.liveUrl ? 'Live' : 'Pending' },
                  { label: 'Repository', value: links.githubUrl ? 'Connected' : 'Missing' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">
                <Code2 className="h-4 w-4" />
                Project Links
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Live Site', href: links.liveUrl, helper: 'Open the deployed product' },
                  { label: 'GitHub', href: links.githubUrl, helper: 'Source code and README' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="text-sm text-slate-400">{item.helper}</div>
                      </div>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10">Open</a>
                      ) : (
                        <span className="shrink-0 rounded-full border border-dashed border-white/10 px-4 py-2 text-sm text-slate-500">Not added</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
                <TrendingUp className="h-4 w-4" />
                Project Health
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Availability', value: links.liveUrl ? 'Public' : 'Private / pending' },
                  { label: 'Collaboration', value: links.githubUrl ? 'Ready' : 'Waiting for repo' },
                  { label: 'Actions', value: linkCount > 0 ? 'Available' : 'Incomplete' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                <AlertCircle className="h-4 w-4" />
                Project Notes
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Deployment status', text: links.liveUrl ? 'Live and accessible from the site button.' : 'Keep this project and add a deploy link later.' },
                  { title: 'Repository setup', text: links.githubUrl ? 'GitHub is attached and ready for collaboration.' : 'Add a GitHub URL to unlock source-level actions.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="font-semibold text-white">{item.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relatedIdeas.length > 0 && (
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">
                <Sparkles className="h-4 w-4" />
                Related Projects
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedIdeas.map((relatedIdea) => <IdeaCard key={relatedIdea.id} idea={relatedIdea} onOpenDetails={() => navigate(`/ideas/${relatedIdea.id}`, { state: { ideas } })} />)}
              </div>
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOpen && (
          <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} idea={idea} onUpdate={handleUpdateIdea} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <DeleteConfirmationModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} idea={idea} onConfirm={handleDeleteConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}