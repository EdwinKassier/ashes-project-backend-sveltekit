<div align="center">

<img src="https://www.edwinkassier.com/Assets/Monogram.png" alt="Ashes Project Monogram" width="80" height="80">

# Ashes Project Backend SvelteKit

**A production-grade SvelteKit API for cryptocurrency analysis.**

[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-Latest-orange.svg)](https://kit.svelte.dev/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)
[![Code style: Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation Options](#installation-options)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Security](#security)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

A rigoruous SvelteKit backend implementing Domain-Driven Design (DDD) for cryptocurrency investment analysis. Validated with extensive unit tests and end-to-end testing pipelines.

### Feature Overview

| **Development**            | **Testing**             | **Deployment**       |
| :------------------------- | :---------------------- | :------------------- |
| Pre-commit hooks (Husky)   | Unit API Tests (Vitest) | Docker containers    |
| Code formatting (Prettier) | Service Tests (Vitest)  | GitHub Actions CI/CD |
| Linting (ESLint)           | E2E tests (Playwright)  | Health monitoring    |
| Hot reload (Vite)          | 100% Type Safety        | Graceful shutdown    |

---

## Key Features

| **Architecture**     | **Security**           | **Data**            | **Performance**  |
| :------------------- | :--------------------- | :------------------ | :--------------- |
| Domain-Driven Design | Rate Limiting          | Prisma ORM          | Serverless Ready |
| Repository Pattern   | Security Headers (CSP) | SQLite / PostgreSQL | Stage-based CI   |
| Service Layers       | Zod Validation         | Data Normalization  | Optimized Docker |

---

## System Architecture

### Application Structure

We follow a strict DDD layering within the SvelteKit `lib/server` directory.

```
src/
├── lib/
│   └── server/
│       ├── domain/              # Enterprise business rules
│       │   ├── schemas/         # Zod contract validation
│       │   ├── entities/        # Pure domain entities (Calculation logic)
│       │   └── errors/          # Custom domain error hierarchy
│       ├── application/         # Application business rules
│       │   └── services/        # Use-case orchestrators
│       └── infrastructure/      # Interface adapters
│           ├── repositories/    # Database access (Prisma)
│           ├── database/        # DB Connection (Singleton)
│           └── api/             # External API clients (Kraken Client)
├── routes/
│   ├── api/
│   │   └── process_request/     # API Gateway / Controller
│   ├── health/                  # Health monitoring
│   └── ready/                   # Readiness monitoring
└── tests/                       # Playwright E2E Tests
```

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- **npm** or **pnpm**

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd ashes-project-backend-sveltekit
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment

Review `.env.example` (if available) and ensure database connection (defaults to local SQLite for dev).

#### 4. Run Tests

```bash
npm run test           # Run Unit Tests
npm run test:e2e       # Run E2E Tests
```

#### 5. Start Development Server

```bash
npm run dev
```

The API will be available at: **http://localhost:5173**

---

## Testing

We use a pyramid testing strategy.

| **Type**     | **Tool**   | **Command**             | **Purpose**                        |
| :----------- | :--------- | :---------------------- | :--------------------------------- |
| **Unit**     | Vitest     | `npm run test`          | Fast feedback on Services & Logic  |
| **Coverage** | Vitest     | `npm run test:coverage` | Ensure code paths are tested       |
| **E2E**      | Playwright | `npm run test:e2e`      | Verify full request implementation |

---

## Code Quality

### Automated Quality Tools

- **ESLint**: Strict TypeScript rules.
- **Prettier**: Consistent formatting.
- **Husky**: Git hooks preventing bad commits.
- **Lint-staged**: Optimizes linting speed.

---

## CI/CD Pipeline

We utilize a rigorous GitHub Actions pipeline ([pipeline.yml](.github/workflows/pipeline.yml)) for continuous integration and delivery.

-   **Code Quality**: TypeScript type checking, ESLint linting, and Prettier format verification.
-   **Test Suite**: Unit & integration tests via Vitest with coverage reporting (Codecov compatible).
-   **Security Scan**: Automated `npm audit` on every push.
-   **Docker Build**: Container build verification with integrated health checks.
-   **Production Deploy**: Automated deployment to **Google Cloud Run** triggered by `prod/v*` tags, including automatic GitHub Release generation.

---

## API Documentation

### Monitoring Endpoints

| **Endpoint** | **Purpose** | **Response** |
|:---|:---|:---|
| `/health` | Basic application health | Status: UP, Uptime, Version |
| `/ready` | Readiness check (DB) | Status: READY, DB Connection |

### `GET /api/process_request`

Analyzes cryptocurrency investment over time.

**Parameters:**

- `symbol` (string, required): Crypto symbol (e.g., BTC, ETH).
- `investment` (number, required): Initial investment amount in USD.

**Response (JSON):**

```json
{
  "result": {
    "symbol": "BTC",
    "investment": 1000,
    "numberOfCoins": 0.05,
    "profit": 500,
    "growthFactor": 0.5,
    "lambos": 0.002
  },
  "graph_data": [
    { "x": "2020-01-01T00:00:00.000Z", "y": 7000 },
    ...
  ]
}
```

---

## Contributing

1. **Fork** the repo.
2. **Create Branch**: `feature/my-feature`.
3. **Commit**: Changes are automatically linted.
4. **Push**: CI will run tests.
5. **Open PR**.

---

## License

MIT
