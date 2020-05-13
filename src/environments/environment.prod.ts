export const environment = {
  production: true,
  auth: {
    clientID: 'fW9r7EF5eQQ8iJCtkxQKzPDErVFtM3uL',
    domain: 'dev-85d746sq.auth0.com', // e.g., https://you.auth0.com/
    audience: 'http://frontend.devinwagner.tech', // e.g., http://localhost:3001
    redirect: 'http://frontend.devinwagner.tech/callback',
    scope: 'openid profile email'
  },
  baseUrl: 'http://backend.devinwagner.tech/api/books'
};
