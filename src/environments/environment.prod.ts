export const environment = {
  production: true,
  auth: {
    clientID: 'fW9r7EF5eQQ8iJCtkxQKzPDErVFtM3uL',
    domain: 'dev-85d746sq.auth0.com', // e.g., https://you.auth0.com/
    audience: 'http://localhost:4200', // e.g., http://localhost:3001
    redirect: 'http://localhost:4200/callback',
    scope: 'openid profile email'
  }
};
