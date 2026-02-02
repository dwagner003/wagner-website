import { createRoot } from 'react-dom/client';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

console.log('=== STARTUP ===');
console.log('URL:', window.location.href);
console.log('Config:', { domain, clientId, audience });

async function init() {
  // If we have a code, handle the callback first
  if (window.location.search.includes('code=')) {
    console.log('Auth callback detected, processing...');

    try {
      const client = await createAuth0Client({
        domain,
        clientId,
        cacheLocation: 'localstorage',
        // authorizationParams: { audience },  // Temporarily disabled
      });

      await client.handleRedirectCallback();
      console.log('Callback processed successfully');

      // Check if we're authenticated now
      const isAuth = await client.isAuthenticated();
      console.log('Is authenticated after callback:', isAuth);

      // Clear URL and reload
      window.history.replaceState({}, '', '/');
    } catch (err) {
      console.error('Callback error:', err);
    }
  }

  // Now render the app
  createRoot(document.getElementById('root')!).render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/`,
        // audience,  // Temporarily disabled
        scope: 'openid profile email',
      }}
    >
      <App />
    </Auth0Provider>
  );
}

init();
