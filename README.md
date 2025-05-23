To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000


src/
├── app.ts                      # Main app instance & route/middleware registration
├── features/                   # Feature-based route modules + services + types
│   ├── books/
│   │   ├── books.routes.ts     # Routes & handlers together (no separate controllers)
│   │   ├── books.service.ts    # Business logic for books
│   │   └── books.types.ts      # Book-related types/interfaces
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.service.ts
│   │   └── users.types.ts
│   ├── email/
│   │   ├── email.service.ts
│   │   └── email.types.ts
│   ├── otp/
│   │   ├── otp.service.ts
│   │   └── otp.types.ts
│   └── order/
│       ├── order.routes.ts
│       ├── order.service.ts
│       └── order.types.ts
├── core/                      # Shared app-wide modules
│   ├── middleware/            # Middleware (auth, logging, etc.)
│   │   └── auth.ts
│   └── utils/                 # Utility helpers (logger, etc.)
│       └── logger.ts
├── config/                    # Config loaders, env validation, constants
│   └── env.ts
└── server.ts                  # Server startup (if separate from app.ts)
