const API_BASE_URL = '/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export const api = {
  // Focus settings
  getFocusSettings: () => fetchApi('/focus/settings'),
  updateFocusSettings: (settings: any) =>
    fetchApi('/focus/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  // Habits
  getHabits: () => fetchApi('/habits'),
  createHabit: (habit: any) =>
    fetchApi('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    }),
  updateHabit: (id: string, habit: any) =>
    fetchApi(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habit),
    }),
  deleteHabit: (id: string) =>
    fetchApi(`/habits/${id}`, {
      method: 'DELETE',
    }),

  // Website blocking
  getBlockedWebsites: () => fetchApi('/websites/blocked'),
  blockWebsite: (url: string) =>
    fetchApi('/websites/block', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  unblockWebsite: (id: string) =>
    fetchApi(`/websites/block/${id}`, {
      method: 'DELETE',
    }),
};