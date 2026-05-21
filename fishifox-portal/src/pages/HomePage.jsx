import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Globe,
  User,
  Tag,
  Sparkles,
  TrendingUp,
  X,
  ChevronUp,
  Mail,
  GitBranch,
  Share2,
  Info,
  Rocket,
  Lightbulb,
  Zap,
  Code2,
  Palette,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DEMO_IDEAS, createEmptyIdea, isValidUrl } from '../lib/portalData';
import { loadIdeas, saveIdea } from '../lib/ideasApi';

const Navbar = ({ activeSection, scrollToSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'submit', label: 'Submit' },
    { id: 'about', label: 'About' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => scrollToSection('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">FishiFox</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === link.id ? 'bg-white/10 text-violet-300' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </button>
            ))}
          </div>

          <button className="md:hidden p-2 text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => { scrollToSection(link.id); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white">
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = ({ scrollToSection }) => (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    <div className="absolute inset-0 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]" />
    </div>

    <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-32 left-20 w-16 h-16 border border-violet-500/30 rounded-2xl backdrop-blur-sm hidden lg:block" />
    <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-32 right-20 w-20 h-20 border border-fuchsia-500/30 rounded-full backdrop-blur-sm hidden lg:block" />
    <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg backdrop-blur-sm hidden lg:block" />

    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300">Now accepting submissions for 2026</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">FishiFox Idea Portal</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">A collaborative platform where FishiFox members share innovative ideas, startups, websites, and creative projects.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollToSection('ideas')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5" />
            Explore Ideas
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollToSection('submit')} className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Submit Idea
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {[
          { label: 'Ideas Shared', value: '24+' },
          { label: 'Team Members', value: '12' },
          { label: 'Categories', value: '6' },
          { label: 'Launched', value: '2026' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>

    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500">
      <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
        <div className="w-1 h-2 bg-slate-400 rounded-full" />
      </div>
    </motion.div>
  </section>
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

const IdeaCard = ({ idea, preview = false, onOpenDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColors = {
    AI: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Agriculture: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Healthcare: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    Education: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Finance: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Web Apps': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className={`group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 ${preview ? 'pointer-events-none' : ''}`}>
      <div className="relative h-48 overflow-hidden bg-slate-800">
        {!imageLoaded && !imageError && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 text-slate-500 animate-spin" /></div>}
        <img src={imageError ? 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80' : idea.image} alt={idea.title} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {idea.trending && <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg"><TrendingUp className="w-3 h-3" />Trending</div>}
        {idea.featured && !idea.trending && <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-violet-500/90 text-white text-xs font-bold backdrop-blur-sm">Featured</div>}
        {!preview && !idea.liveUrl && <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">Not deployed yet</div>}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[idea.category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>{idea.category}</span>
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

          {!preview && (
            <div className="flex items-center gap-2">
              <motion.button type="button" onClick={() => onOpenDetails?.(idea)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                <Info className="w-4 h-4" />
                Details
              </motion.button>

              {idea.liveUrl ? (
                <motion.a href={idea.liveUrl} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              ) : (
                <div className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500">No host</div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedIdeas = ({ ideas, onOpenDetails }) => {
  const featured = ideas.filter((idea) => idea.featured || idea.trending).slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500"><Sparkles className="w-5 h-5 text-white" /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Featured & Trending</h2>
            <p className="text-sm text-slate-400">Hand-picked highlights from our team</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((idea, index) => (
            <motion.div key={idea.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <IdeaCard idea={idea} onOpenDetails={onOpenDetails} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IdeasGrid = ({ ideas, onOpenDetails }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = ideas
    .filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase()) || idea.description.toLowerCase().includes(search.toLowerCase()) || idea.member.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || idea.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.date) - new Date(a.date);
      if (sort === 'a-z') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <section id="ideas" className="py-24 relative">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-900/10 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm mb-4">
            <Lightbulb className="w-4 h-4" />
            Innovation Gallery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Ideas</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Browse through innovative projects submitted by our talented team members.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas, members, or tags..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="pl-9 pr-8 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer">
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer">
                <option value="newest">Newest</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${category === cat ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="rounded-2xl bg-white/5 border border-white/10 p-4 animate-pulse">
                <div className="h-48 bg-slate-800/50 rounded-xl mb-4" />
                <div className="h-4 bg-slate-800/50 rounded w-1/3 mb-3" />
                <div className="h-6 bg-slate-800/50 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-800/50 rounded w-full mb-2" />
                <div className="h-4 bg-slate-800/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((idea) => <IdeaCard key={idea.id} idea={idea} onOpenDetails={onOpenDetails} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No ideas found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const SubmitForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(createEmptyIdea());
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.member.trim()) newErrors.member = 'Member name is required';
    if (!isValidUrl(formData.liveUrl)) newErrors.liveUrl = 'Invalid URL format';
    if (!isValidUrl(formData.githubUrl)) newErrors.githubUrl = 'Invalid URL format';
    if (!isValidUrl(formData.forkUrl)) newErrors.forkUrl = 'Invalid URL format';
    if (!isValidUrl(formData.issueUrl)) newErrors.issueUrl = 'Invalid URL format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setToast({ message: 'Please fix the errors below', type: 'error' });
      return;
    }

    const result = await onSubmit({
      ...formData,
      liveUrl: formData.liveUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
      forkUrl: formData.forkUrl.trim(),
      issueUrl: formData.issueUrl.trim(),
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      featured: false,
      trending: false,
    });

    if (result !== false) {
      setFormData(createEmptyIdea());
      setPreview(false);
    }
  };

  const handleReset = () => {
    setFormData(createEmptyIdea());
    setErrors({});
    setPreview(false);
  };

  return (
    <section id="submit" className="py-24 relative">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
            <Plus className="w-4 h-4" />
            Share Your Vision
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Submit Your Idea</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Have a groundbreaking project? Share it with the FishiFox team and get feedback from our innovators.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
                <input type="text" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${errors.title ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="e.g., SmartFarm AI" />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} rows={3} className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${errors.description ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none`} placeholder="Describe your project in a few sentences..." />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Live Site URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="url" value={formData.liveUrl} onChange={(event) => setFormData({ ...formData, liveUrl: event.target.value })} className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border ${errors.liveUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="Optional if not deployed yet" />
                  </div>
                  {errors.liveUrl && <p className="mt-1 text-sm text-red-400">{errors.liveUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none">
                      {CATEGORIES.filter((categoryName) => categoryName !== 'All').map((categoryName) => <option key={categoryName} value={categoryName}>{categoryName}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                  <input type="url" value={formData.githubUrl} onChange={(event) => setFormData({ ...formData, githubUrl: event.target.value })} className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${errors.githubUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="https://github.com/..." />
                  {errors.githubUrl && <p className="mt-1 text-sm text-red-400">{errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fork URL</label>
                  <input type="url" value={formData.forkUrl} onChange={(event) => setFormData({ ...formData, forkUrl: event.target.value })} className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${errors.forkUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="https://github.com/.../fork" />
                  {errors.forkUrl && <p className="mt-1 text-sm text-red-400">{errors.forkUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Issue URL</label>
                  <input type="url" value={formData.issueUrl} onChange={(event) => setFormData({ ...formData, issueUrl: event.target.value })} className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${errors.issueUrl ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="https://github.com/.../issues" />
                  {errors.issueUrl && <p className="mt-1 text-sm text-red-400">{errors.issueUrl}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail URL</label>
                  <input type="url" value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" placeholder="https://images.unsplash.com/..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Member Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={formData.member} onChange={(event) => setFormData({ ...formData, member: event.target.value })} className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border ${errors.member ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all`} placeholder="Your name" />
                  </div>
                  {errors.member && <p className="mt-1 text-sm text-red-400">{errors.member}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={preview} onChange={(event) => setPreview(event.target.checked)} className="w-4 h-4 rounded border-white/20 bg-slate-800/50 text-violet-500 focus:ring-violet-500/20" />
                  <span className="text-sm text-slate-400">Live Preview</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Idea
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleReset} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 transition-all">Reset</motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`transition-all duration-500 ${preview ? 'opacity-100' : 'opacity-50'}`}>
            <div className="sticky top-24">
              <div className="text-sm text-slate-400 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" />Live Preview</div>
              <IdeaCard idea={{ ...formData, id: 'preview', date: new Date().toISOString().split('T')[0], featured: false, trending: false, image: formData.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', liveUrl: formData.liveUrl, githubUrl: formData.githubUrl, forkUrl: formData.forkUrl, issueUrl: formData.issueUrl }} preview />
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
    </section>
  );
};

const About = () => {
  const features = [
    { icon: <Rocket className="w-6 h-6" />, title: 'Innovation First', desc: 'We prioritize groundbreaking ideas that push boundaries and solve real-world problems.' },
    { icon: <Users className="w-6 h-6" />, title: 'Collaborative Spirit', desc: 'Cross-functional teams work together to refine and launch ideas into reality.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Rapid Prototyping', desc: 'From concept to MVP in record time with our streamlined development process.' },
    { icon: <Code2 className="w-6 h-6" />, title: 'Tech Excellence', desc: 'Leveraging cutting-edge technologies to build scalable, modern solutions.' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-4">
              <Palette className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What is FishiFox Idea Portal?</h2>
            <p className="text-slate-400 leading-relaxed mb-6">The FishiFox Idea Portal is our internal innovation engine a dedicated space where team members can showcase their passion projects, startup concepts, and creative experiments.</p>
            <p className="text-slate-400 leading-relaxed mb-8">Whether it's an AI-powered agriculture tool, a healthcare disruptor, or the next big web app, every idea gets the visibility it deserves. We believe great innovations start with sharing.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-300 mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 border border-white/10 p-8">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">FishiFox Team</h3>
                    <p className="text-sm text-slate-400">Innovation-driven collective</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Active Projects', value: '12' },
                    { label: 'Team Members', value: '8' },
                    { label: 'Success Rate', value: '85%' },
                    { label: 'Avg. Launch Time', value: '3 mo' },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className="text-white font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative py-12 border-t border-white/10 bg-slate-950">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">FishiFox</span>
        </div>

        <div className="flex items-center gap-4">
          {[GitBranch, Share2, Users, Mail].map((Icon, index) => (
            <motion.a key={index} href="#" whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>

        <p className="text-sm text-slate-500">© 2026 FishiFox Idea Portal — Empowering Innovation.</p>
      </div>
    </div>
  </footer>
);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-violet-500/50 transition-shadow">
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState(DEMO_IDEAS);
  const [activeSection, setActiveSection] = useState('home');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPortalIdeas = async () => {
      const ideasFromServer = await loadIdeas();
      if (isMounted && Array.isArray(ideasFromServer) && ideasFromServer.length > 0) {
        setIdeas(ideasFromServer);
      }
    };

    loadPortalIdeas();

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'ideas', 'submit', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (newIdea) => {
    try {
      const savedIdea = await saveIdea(newIdea);
      setIdeas((previousIdeas) => [savedIdea, ...previousIdeas]);
      setToast({ message: 'Your idea has been published!', type: 'success' });
      setTimeout(() => scrollToSection('ideas'), 500);
      return true;
    } catch {
      setIdeas((previousIdeas) => [newIdea, ...previousIdeas]);
      setToast({ message: 'Saved locally, but the backend was unavailable.', type: 'error' });
      setTimeout(() => scrollToSection('ideas'), 500);
      return false;
    }
  };

  const handleOpenDetails = (idea) => {
    navigate(`/ideas/${idea.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-violet-500/30">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      <Hero scrollToSection={scrollToSection} />
      <FeaturedIdeas ideas={ideas} onOpenDetails={handleOpenDetails} />
      <IdeasGrid ideas={ideas} onOpenDetails={handleOpenDetails} />
      <SubmitForm onSubmit={handleSubmit} />
      <About />
      <Footer />
      <BackToTop />

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}