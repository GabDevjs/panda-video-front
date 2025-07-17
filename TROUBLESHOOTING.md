# 🔧 Troubleshooting - Panda Video Frontend

## ❌ Problema: Página /videos não mostra nada

### Possíveis Causas:

1. **Erro de importação no Vue**
   - **Erro**: `onUnmounted is not defined`
   - **Solução**: ✅ **CORRIGIDO** - Import adicionado em `VideosView.vue`

2. **Backend não está rodando**
   ```bash
   # Verificar se backend está funcionando
   curl http://localhost:3000/health
   
   # Deve retornar:
   {"status":"healthy","timestamp":"...","services":{"database":"connected","redis":"connected","ffmpeg":"available"}}
   ```

3. **Problemas de CORS**
   - **Solução**: ✅ **CORRIGIDO** - CORS configurado no backend para aceitar `localhost:8080`

4. **Token JWT expirado**
   - **Solução**: Fazer login novamente em `/login`

5. **Frontend não conecta com backend**
   - Verificar se a variável `VITE_API_URL` está correta no `.env`

## 🔍 Como Debuggar:

### 1. Abrir DevTools do Navegador (F12)

#### Console Tab:
Procure por logs como:
```
API Request: GET /videos
Token found and added to request
API Response: 200 /videos
Videos response: {videos: [...], pagination: {...}}
Videos store updated: X videos
```

#### Network Tab:
- Verificar se requisições para `http://localhost:3000/api/videos` estão sendo feitas
- Status code deve ser `200`
- Headers devem incluir `Authorization: Bearer <token>`

### 2. Verificar LocalStorage

No Console do navegador:
```javascript
// Verificar se token existe
localStorage.getItem('token')

// Verificar dados do usuário
localStorage.getItem('user')

// Limpar em caso de problemas
localStorage.clear()
```

### 3. Testar API Manualmente

```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'

# 2. Copiar o token da resposta e testar vídeos
curl -X GET http://localhost:3000/api/videos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🚀 Soluções Rápidas:

### Solução 1: Restart Completo
```bash
# Parar tudo
docker-compose down

# Iniciar novamente
docker-compose up --build

# Aguardar ~30 segundos e acessar http://localhost:8080
```

### Solução 2: Limpar Cache do Navegador
1. Abrir DevTools (F12)
2. Botão direito no botão reload
3. Selecionar "Empty Cache and Hard Reload"

### Solução 3: Verificar Logs do Docker
```bash
# Logs do frontend
docker-compose logs frontend

# Logs do backend
docker-compose logs backend

# Logs de todos os serviços
docker-compose logs
```

### Solução 4: Rebuild Frontend
```bash
cd panda-video-frontend
npm run build
```

## 🆘 Se nada funcionar:

### Teste Básico de Conectividade:

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Frontend Access:**
   - Acesse `http://localhost:8080`
   - Deve carregar a página de login

3. **Database Check:**
   ```bash
   docker-compose exec postgres psql -U postgres -d panda_video -c "SELECT * FROM users;"
   ```

4. **Redis Check:**
   ```bash
   docker-compose exec redis redis-cli ping
   ```

### Recriação Completa:

```bash
# 1. Parar e limpar tudo
docker-compose down -v
docker system prune -f

# 2. Rebuild completo
docker-compose build --no-cache

# 3. Iniciar novamente
docker-compose up
```

## 📝 Logs de Debug Ativados

O sistema agora inclui logs detalhados:

### Frontend (Console do navegador):
- `API Request: GET /videos` - Requisição sendo feita
- `Token found and added to request` - Token JWT encontrado
- `API Response: 200 /videos` - Resposta da API
- `Videos response: {...}` - Dados retornados
- `Videos store updated: X videos` - Store atualizado

### Backend (Docker logs):
- Requisições HTTP via Morgan
- Erros de autenticação
- Erros de banco de dados
- Status de processamento de vídeos

## 🔧 Configurações Importantes:

### Backend CORS:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
  credentials: true
}));
```

### Frontend API Config:
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

### Environment Variables:
```bash
# Frontend .env
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development

# Backend .env
DB_HOST=postgres
REDIS_HOST=redis
JWT_SECRET=panda_video_super_secret_jwt_key_2025
```

---

**Se o problema persistir, verifique os logs detalhados no console do navegador e nos containers Docker.**