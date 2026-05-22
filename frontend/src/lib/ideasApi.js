import { DEMO_IDEAS } from './portalData';
import { isFirebaseConfigured, auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

const MOCK_IDEAS_KEY = 'fishifox_ideas';
const MOCK_USERS_KEY = 'fishifox_users';

// --- LocalStorage Fallback Helpers ---

function getMockIdeas() {
  const local = localStorage.getItem(MOCK_IDEAS_KEY);
  if (!local) {
    localStorage.setItem(MOCK_IDEAS_KEY, JSON.stringify(DEMO_IDEAS));
    return DEMO_IDEAS;
  }
  try {
    return JSON.parse(local);
  } catch {
    return DEMO_IDEAS;
  }
}

function saveMockIdeas(ideas) {
  localStorage.setItem(MOCK_IDEAS_KEY, JSON.stringify(ideas));
}

function getMockUsers() {
  const local = localStorage.getItem(MOCK_USERS_KEY);
  if (!local) {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'owner@fishifox.com';
    const initialUsers = [{ email: adminEmail, password: 'password123' }];
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(local);
  } catch {
    return [];
  }
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// --- API Functions ---

export async function loadIdeas() {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideas = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ideas.push({
          ...data,
          id: doc.id
        });
      });

      if (ideas.length === 0) {
        return DEMO_IDEAS;
      }

      // Sort ideas by date descending
      return ideas.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Firestore loadIdeas failed, returning mock/demo ideas:', error);
      return getMockIdeas();
    }
  } else {
    return getMockIdeas();
  }
}

export async function saveIdea(idea, userEmail) {
  const newIdea = {
    title: idea.title,
    description: idea.description,
    url: idea.liveUrl || idea.url || '',
    liveUrl: idea.liveUrl || idea.url || '',
    githubUrl: idea.githubUrl || '',
    category: idea.category,
    image: idea.image || '',
    member: idea.member,
    date: new Date().toISOString().split('T')[0],
    featured: false,
    trending: false,
    likes: idea.likes || [],
    creatorEmail: userEmail ? userEmail.toLowerCase() : '',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'ideas'), newIdea);
      return {
        ...newIdea,
        id: docRef.id
      };
    } catch (error) {
      console.error('Firestore saveIdea failed, falling back to local save:', error);
      throw error;
    }
  } else {
    const mockIdeas = getMockIdeas();
    const savedIdea = {
      ...newIdea,
      id: String(Date.now())
    };
    mockIdeas.unshift(savedIdea);
    saveMockIdeas(mockIdeas);
    return savedIdea;
  }
}

export async function updateIdea(id, idea, userEmail) {
  const updatedData = {
    title: idea.title,
    description: idea.description,
    url: idea.liveUrl || idea.url || '',
    liveUrl: idea.liveUrl || idea.url || '',
    githubUrl: idea.githubUrl || '',
    category: idea.category,
    image: idea.image || '',
    member: idea.member,
    creatorEmail: idea.creatorEmail ? idea.creatorEmail.toLowerCase() : (userEmail ? userEmail.toLowerCase() : ''),
    likes: idea.likes || [],
    featured: idea.featured || false,
    trending: idea.trending || false
  };

  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'ideas', id);
      await updateDoc(docRef, updatedData);
      return {
        ...idea,
        ...updatedData,
        id
      };
    } catch (error) {
      console.error('Firestore updateIdea failed:', error);
      throw error;
    }
  } else {
    const mockIdeas = getMockIdeas();
    const index = mockIdeas.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      throw new Error('Idea not found');
    }
    const updatedIdea = {
      ...mockIdeas[index],
      ...updatedData,
      id
    };
    mockIdeas[index] = updatedIdea;
    saveMockIdeas(mockIdeas);
    return updatedIdea;
  }
}

export async function deleteIdea(id, userEmail) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'ideas', id);
      await deleteDoc(docRef);
      return { message: 'Idea deleted successfully', id };
    } catch (error) {
      console.error('Firestore deleteIdea failed:', error);
      throw error;
    }
  } else {
    const mockIdeas = getMockIdeas();
    const filtered = mockIdeas.filter(item => String(item.id) !== String(id));
    saveMockIdeas(filtered);
    return { message: 'Idea deleted successfully', id };
  }
}

export async function registerUser(email, password) {
  if (!email || !/^[a-zA-Z0-9._%+-]+@fishifox\.com$/.test(email)) {
    throw new Error('Please use a valid FishiFox email (e.g. name@fishifox.com)');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { message: 'User registered successfully', email: userCredential.user.email };
    } catch (error) {
      // If Firebase Auth provider is not enabled, fall back to local auth
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/admin-restricted-operation') {
        console.warn('Firebase Auth provider not enabled. Falling back to local auth.');
        const mockUsers = getMockUsers();
        const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          throw new Error('This email is already registered.');
        }
        mockUsers.push({ email: email.toLowerCase(), password });
        saveMockUsers(mockUsers);
        return { message: 'User registered successfully (local mode)', email };
      }
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters long';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      throw new Error(message);
    }
  } else {
    const mockUsers = getMockUsers();
    const exists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('This email is already registered.');
    }
    mockUsers.push({ email: email.toLowerCase(), password });
    saveMockUsers(mockUsers);
    return { message: 'User registered successfully', email };
  }
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { message: 'Login successful', email: userCredential.user.email };
    } catch (error) {
      // If Firebase Auth provider is not enabled, fall back to local auth
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/admin-restricted-operation') {
        console.warn('Firebase Auth provider not enabled. Falling back to local auth.');
        const mockUsers = getMockUsers();
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        return { message: 'Login successful (local mode)', email: user.email };
      }
      let message = 'Invalid email or password';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else {
        message = error.message;
      }
      throw new Error(message);
    }
  } else {
    const mockUsers = getMockUsers();
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return { message: 'Login successful', email: user.email };
  }
}