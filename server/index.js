import { createApp } from './app.js';
const port = Number(process.env.PORT || 3001);
createApp().listen(port, '0.0.0.0', () =>
  console.log(`Rayoni server ready at http://localhost:${port}`),
);
