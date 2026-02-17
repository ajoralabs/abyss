import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from './auth';

/**
 * Standard server function to fetch the current session.
 * Reusable across loaders and other server functions.
 */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders();

  // Pass headers to Better Auth
  const session = await auth.api.getSession({
    headers,
  });

  return session;
});

/**
 * Example server function for organization fetching.
 */
export const getOrganizations = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession();
  if (!session) return [];

  return await auth.api.listOrganizations({
    headers: getRequestHeaders(),
  });
});
