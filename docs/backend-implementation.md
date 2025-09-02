# Guía de implementación backend (Spring Boot + Opcional IA)

Esta guía define arquitectura, entidades, endpoints, seguridad, integración con el frontend (Expo/React Native) y, opcionalmente, un microservicio de IA (Python)

## 1. Arquitectura y módulos

- **Stack**: Java 21, Spring Boot 3.x, Spring Security, Spring Web, Spring Data JPA, PostgreSQL (o MySQL), Lombok, WebSocket (STOMP), Spring Cache (Redis opcional), Spring Validation.
- **Módulos lógicos**:
  - `auth`: autenticación/usuarios/JWT
  - `opportunities`: ideas de inversión (detección, puntuación, categorías)
  - `portfolio`: carteras, posiciones, trades
  - `news`: agregación de noticias y fuentes
  - `alerts`: alertas en tiempo real (cambios bruscos, earnings, etc.)
  - `analytics`: métricas y performance, recomendaciones (IA/heurísticas)
  - `realtime`: notificaciones por WebSocket

## 4. Modelo de datos (DDL con Flyway)

Crea `V1__init.sql` con tablas base:
```
-- users y roles
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  theme VARCHAR(12) NOT NULL DEFAULT 'system'
);

-- opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY,
  symbol VARCHAR(16) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  change_pct NUMERIC(6,2) NOT NULL,
  recommendation VARCHAR(32),
  confidence INTEGER,
  reason TEXT,
  category VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- portfolio
CREATE TABLE portfolios (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE positions (
  id UUID PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id),
  symbol VARCHAR(16) NOT NULL,
  shares NUMERIC(18,6) NOT NULL,
  avg_price NUMERIC(12,2) NOT NULL,
  current_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE trades (
  id UUID PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id),
  symbol VARCHAR(16) NOT NULL,
  side VARCHAR(8) NOT NULL, -- BUY/SELL
  shares NUMERIC(18,6) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  executed_at TIMESTAMP NOT NULL
);

-- news
CREATE TABLE news (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  source VARCHAR(128),
  category VARCHAR(64),
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMP NOT NULL
);

-- alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(32) NOT NULL, -- PRICE_SPIKE, EARNINGS, CUSTOM
  symbol VARCHAR(16),
  threshold NUMERIC(12,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 6. Contratos API (REST)

Base path: `/api/v1`

- Auth
  - `POST /auth/register` {email,password,displayName} → 201 + {token,user}
  - `POST /auth/login` {email,password} → 200 + {token,user}
  - `GET /auth/me` → user

- Opportunities
  - `GET /opportunities?category=trending&page=0&size=20` → Page<OpportunityDTO>
  - `POST /opportunities/{id}/watchlist` (auth)

- Portfolio
  - `GET /portfolio` → lista de carteras del usuario
  - `POST /portfolio` {name}
  - `GET /portfolio/{id}` → detalle + posiciones agregadas
  - `POST /portfolio/{id}/trade` {symbol, side, shares, price}
  - `GET /portfolio/{id}/holdings` → posiciones

- News
  - `GET /news?category=all&page=0&size=20`
  - `GET /news/{id}`

- Alerts
  - `GET /alerts` (user)
  - `POST /alerts` {type, symbol, threshold}
  - `PATCH /alerts/{id}` activar/desactivar

- Analytics
  - `GET /analytics/portfolio/{id}/summary` → {totalValue,totalGain,...}
  - `GET /analytics/opportunities/recommended` → lista recomendada (IA/heurística)

Notas:
- Respuestas en JSON con DTOs.
- Paginación estándar Spring (Pageable) y `Page<T>`.

## 8. Servicios por dominio (orquestación)

- `OpportunityService`
  - listar por categoría, score, trending; persistir/actualizar oportunidades importadas
- `PortfolioService`
  - crear cartera, registrar trade (actualiza `positions` con promedio ponderado y shares),
    calcular `current_price` (pull a proveedor o caché),
  - exponer agregados (valor total, ganancia, coste)
- `NewsService`
  - agregar noticias de fuentes externas (RSS/APIs); normalizar y guardar; paginar consumo
- `AlertService`
  - CRUD alertas; evaluación periódica (scheduler) y notificación (WebSocket/email/push)
- `AnalyticsService`
  - métricas, KPIs; endpoint de recomendaciones (usa heurísticas o llama microservicio IA)

## 9. Integración con el frontend

- Autenticación: el frontend enviará JWT en `Authorization`.
- Rutas sugeridas para pantallas:
  - Home: `GET /analytics/portfolio/{mainId}/summary`, `GET /opportunities?category=trending&size=5`
  - Opportunities: `GET /opportunities?category=ai-recommended` etc.
  - Portfolio: `GET /portfolio`, `GET /portfolio/{id}/holdings`, `POST /portfolio/{id}/trade`
  - News: `GET /news?category=market`
  - Profile: `GET /auth/me`, `PATCH /users/me/settings` (tema)

## 10. Proveedor de datos de mercado (mock → real)

- Fase 1 (mock): programar un `@Scheduled` que simule precios y trending y llene `opportunities`.
- Fase 2 (real): integrar proveedor (Finnhub, Alpha Vantage, Polygon.io). Crea `MarketDataClient` con `WebClient`, caché corta en Redis.

## 11. Recomendador de acciones (IA opcional)

### Opción A: Heurística en Java
- Reglas: momentum (change_pct), volumen (si lo traes), eventos (earnings próximos), sector rotación.
- Guarda `confidence` y `recommendation`.

### Opción B: Microservicio Python
- FastAPI + scikit-learn/pandas/ta; endpoint `POST /recommend` recibe {symbols, features} y responde ranking.
- Spring llama vía `WebClient` (timeout, circuit breaker opcional con Resilience4j).
- Seguridad: token compartido o red privada.

Esquema request/response:
```json
// POST http://ia:8000/recommend
{"symbols":["AAPL","TSLA"],"features":{"window":14}}
// Response
{"recommendations":[{"symbol":"NVDA","score":0.91}]}
```

## 12. News: ingestión

- Fuentes: RSS (Reuters, CNBC) o APIs (NewsAPI).
- Job `@Scheduled` cada 5-10min:
  1) Fetch → 2) Normaliza → 3) Upsert por `url`/`title+published_at` → 4) Elimina antiguos con TTL.

## 13. Alerts y tiempo real

- Crear endpoint CRUD de alertas.
- Evaluador `@Scheduled(fixedDelay=60000)` que revise condiciones (precio actual vs threshold).
- Notificación por WebSocket: STOMP `/topic/alerts/{userId}`. Front suscrito para toasts/badges.

## 14. WebSockets

- Configura STOMP en `/ws` y broker simple `/topic`.
- Envía eventos: `price-move`, `new-opportunity`, `alert-fired`.

## 15. Performance y caching

- Cachear respuestas frecuentes (`@Cacheable`) con TTL (Redis recomendado).
- Paginación por defecto `size=20`, límites máximos.
- Índices: `opportunities(symbol)`, `news(published_at)`, `positions(portfolio_id)`.

## 16. Observabilidad

- Actuator `/actuator/health`.
- Logs estructurados (JSON) en prod.
- Traza de errores con `@ControllerAdvice` global.

## 17. Seguridad adicional

- Validación `@Validated` en requests.
- Rate limiting (gateway o bucket4j si expones públicamente).
- CORS para orígenes de la app Expo (`http://localhost:19006`, etc.).

## 18. Migraciones y datos de prueba

- Flyway para schema; `V2__seed.sql` con datos demo (opcional).
- Perfil `dev` con `spring.jpa.hibernate.ddl-auto=validate` y `data.sql` para inserts mock.

## 19. Pasos de implementación

1) Configurar DB + Flyway (sección 3 y 4)
2) Terminar `auth` (login/register/me, JWT)
3) `opportunities`: entidad, repo, service, controller + seed/mock job
4) `portfolio`: carteras, trades, posiciones, cálculos
5) `news`: ingestión programada + endpoints
6) `analytics`: summary de cartera + recomendaciones básicas
7) `alerts`: CRUD + scheduler + WebSocket notificaciones
8) WebSocket configuración y eventos
9) Integración con proveedor real (cuando listo)
10) (Opcional) Microservicio IA Python y cliente en Java

## 20. Contratos de respuesta (ejemplos)

- OpportunityDTO
```json
{
  "id":"uuid",
  "symbol":"AAPL",
  "name":"Apple Inc.",
  "price":175.43,
  "changePct":1.33,
  "recommendation":"Strong Buy",
  "confidence":85,
  "reason":"Earnings growth",
  "category":"trending"
}
```
- Portfolio summary
```json
{
  "totalValue":24500.0,
  "totalGain":1250.0,
  "totalGainPercent":5.36,
  "totalCost":23250.0,
  "todayChange":320.0,
  "todayChangePercent":1.2
}
```

## 21. Despliegue

- Conteneriza: Docker para API y DB.
- Variables: `SPRING_DATASOURCE_*`, `APP_JWT_SECRET`.
- Reverse proxy (Nginx/Traefik). HTTPS obligatorio.

## 22. Integración con la app (resumen)

- Usa base URL `https://api.tu-dominio.com/api/v1`.
- Envía JWT en todas las llamadas autenticadas.
- Paginación en listas (o infinitescroll).
- Suscríbete a `/ws` para alertas en tiempo real.

---

Con esta guía puedes implementar el backend incrementalmente. Si quieres, puedo generar esqueletos de `Controller/Service/Repository` y los `V1__init.sql` directamente en tu proyecto.
