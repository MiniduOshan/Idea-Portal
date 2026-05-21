import { DEMO_IDEAS, IDEAS_API_URL } from './portalData';

export async function loadIdeas() {
  try {
    const response = await fetch(IDEAS_API_URL);
    if (!response.ok) {
      throw new Error('Failed to load ideas');
    }

    const ideasFromServer = await response.json();
    return Array.isArray(ideasFromServer) && ideasFromServer.length > 0 ? ideasFromServer : DEMO_IDEAS;
  } catch {
    return DEMO_IDEAS;
  }
}

export async function saveIdea(idea) {
  const response = await fetch(IDEAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(idea),
  });

  if (!response.ok) {
    throw new Error('Failed to save idea');
  }

  return response.json();
}