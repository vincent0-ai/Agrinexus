# Agricultural Web App — Final Backend Structure & Team Workflow

## 1. Final Folder Structure (with fixes applied)

```
agrinexus/
├── backend/
│   ├── index.php                      # Entry point — bootstraps env, config, routes
│   ├── composer.json                  # Dependencies + PSR-4 autoload
│   ├── .env.example                   # Template (real .env is gitignored)
│   ├── .gitignore
│   │
│   ├── config/
│   │   ├── cors.php
│   │   ├── database.php
│   │   └── env.php
│   │
│   ├── controllers/
│   │   ├── AuthController.php
│   │   ├── ProductController.php
│   │   ├── CategoryController.php     # added
│   │   ├── OrderController.php
│   │   ├── MarketController.php
│   │   ├── WeatherController.php
│   │   └── IotController.php
│   │
│   ├── models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php               # added
│   │   ├── Order.php
│   │   ├── MarketPrice.php
│   │   └── SensorReading.php
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.php
│   │   └── RateLimit.php
│   │
│   ├── services/
│   │   ├── JWTService.php
│   │   ├── WeatherApiService.php
│   │   ├── AIMarket.php
│   │   └── NotificationService.php    # added
│   │
│   ├── utils/
│   │   ├── Response.php
│   │   ├── Validator.php
│   │   ├── Paginator.php              # added
│   │   └── ErrorHandler.php           # added
│   │
│   ├── uploads/
│   │   └── .gitkeep                   # folder tracked, contents gitignored
│   │
│   ├── database/
│   │   ├── migrations/                # added — versioned, not one flat file
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_products_categories.sql
│   │   │   ├── 003_create_orders.sql
│   │   │   ├── 004_create_market_prices.sql
│   │   │   └── 005_create_sensor_readings.sql
│   │   ├── schema.sql                 # full current schema, generated from migrations
│   │   └── seed.sql
│   │
│   ├── routes/
│   │   ├── api.php                    # combines all route files below
│   │   ├── auth.routes.php            # split per domain — see §3
│   │   ├── product.routes.php
│   │   ├── order.routes.php
│   │   ├── market.routes.php
│   │   ├── weather.routes.php
│   │   └── iot.routes.php
│   │
│   ├── logs/                          # added
│   │   └── .gitkeep
│   │
│   └── tests/                         # added — PHPUnit
│       ├── AuthControllerTest.php
│       └── ProductControllerTest.php
│
├── frontend/                          # TypeScript app — owned entirely by frontend dev


---

## 2. Who Owns What

With 4 people, split by **vertical ownership** (whole files end-to-end), not by layer — this is what actually prevents two people editing the same file:

| Person | Owns | Touches |
|---|---|---|
| **Backend Dev 1** (Auth & Core) | `AuthController`, `User` model, `AuthMiddleware`, `RateLimit`, `JWTService`, `ErrorHandler`, `Response`/`Validator` utils, `config/` | `auth.routes.php` |
| **Backend Dev 2** (Domain Features) | `ProductController`, `CategoryController`, `OrderController`, `MarketController`, `WeatherController`, `IotController` + their models, `WeatherApiService`, `AIMarket`, `NotificationService` | `product/order/market/weather/iot.routes.php` |
| **Database Owner** | `database/migrations/`, `schema.sql`, `seed.sql`, `docs/ERD.md` | Reviews any model changes from both backend devs before they touch the DB |
| **Frontend Dev** | Entire `frontend/` folder (TypeScript) | Builds against `docs/API_CONTRACT.md` + mock data — never touches `backend/` |
| **Research** | Feeds market/weather data sources and crop logic into `docs/` and `seed.sql`/`AIMarket.php` as written specs — doesn't need own code folder, pairs with Backend Dev 2 when implementing | `docs/` |

If your team genuinely doesn't have 2 backend people, collapse Dev 1 + Dev 2 into one person — the rest of the split still holds.

---

## 3. The Conflict-Avoidance Tactics (the actual fixes)

**a. Split `routes/api.php` into per-domain files.**
A single shared routes file is the #1 source of merge conflicts on small teams — everyone edits the same lines. Each person now owns their own `*.routes.php`; `api.php` just does:
```php
require 'auth.routes.php';
require 'product.routes.php';
require 'order.routes.php';
// ...
```

**b. Migrations instead of one `schema.sql`.**
Each schema change is a new numbered file. Two people changing the schema the same week create two new files instead of both editing line 40 of the same `schema.sql`.


**c. Models are single-owner.**
Backend Dev 1 never touches `Product.php`; Backend Dev 2 never touches `User.php`. If Dev 2 needs user data, they call a method Dev 1 exposes — not edit the User model directly.

---

## 4. Suggested Sequencing (Week 1)

1. **Day 1–2**: Database Owner + both backend devs agree on schema → first migrations written. Frontend + backend agree on `API_CONTRACT.md`.
2. **Day 2 onward**: Backend devs build controllers/models in parallel (different files, no overlap). Frontend builds UI against mocked contract data — doesn't wait for real endpoints.
3. **End of week**: First real integration — frontend points at real backend, contract mismatches get fixed via PR against `API_CONTRACT.md`, not Slack messages.

---

## 5. Git Workflow

```
main                → deployable
dev                 → integration branch
feature/be1-auth        Backend Dev 1
feature/be2-orders      Backend Dev 2 (one branch per feature, not one branch for everything)
feature/db-migrations   Database Owner
feature/fe-dashboard    Frontend Dev
```