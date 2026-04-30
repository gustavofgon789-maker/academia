import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Gel Veículos API rodando na porta ${env.PORT}`);
  console.log(`📁 Uploads em: ${env.UPLOAD_DIR}`);
  console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
});
