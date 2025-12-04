import app from './app';
import { PORT } from './utils/env';

app.listen(PORT, () => {
  console.log(`\n Server E-Commerce HARI 5 (MVC + Service Layer) jalan di http://localhost:${PORT}`);
  console.log(` Jangan lupa kirim header: X-API-Key: secret-api-key-123`);
});