import { DEMO_IDEAS, IDEAS_API_URL, API_BASE_URL } from './portalData';

export async function loadIdeas() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(IDEAS_API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to load ideas');
    }

    const ideasFromServer = await response.json();
    if (Array.isArray(ideasFromServer) && ideasFromServer.length > 0) {
      return ideasFromServer.map(idea => ({
        ...idea,
        id: idea.id || idea._id
      }));
    }
    return DEMO_IDEAS;
  } catch {
    return DEMO_IDEAS;
  }
}

export async function saveIdea(idea, userEmail) {
  const response = await fetch(IDEAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail || '',
    },
    body: JSON.stringify(idea),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to save idea');
  }

  const savedIdea = await response.json();
  return {
    ...savedIdea,
    id: savedIdea.id || savedIdea._id
  };
}

export async function updateIdea(id, idea, userEmail) {
  const response = await fetch(`${IDEAS_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail || '',
    },
    body: JSON.stringify(idea),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update idea');
  }

  const updatedIdea = await response.json();
  return {
    ...updatedIdea,
    id: updatedIdea.id || updatedIdea._id
  };
}

export async function deleteIdea(id, userEmail) {
  const response = await fetch(`${IDEAS_API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'X-User-Email': userEmail || '',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete idea');
  }

  return response.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
}