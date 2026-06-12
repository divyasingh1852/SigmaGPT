// Vite exposes environment variables that start with VITE_
// We set VITE_API_URL in .env (local) and in Render (production)

const server = import.meta.env.VITE_API_URL;

export default server;
