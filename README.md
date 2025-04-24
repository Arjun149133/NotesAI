# Project Setup Guide

This repository contains a web application built with [Bun](https://bun.sh/) and [Supabase](https://supabase.com/), using [Prisma](https://www.prisma.io/) as an ORM.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Supabase](https://supabase.com/) account with a project created
- Git

### Installation and Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure Supabase**

   - Create a new project in your Supabase dashboard
   - Note down your project URL and API keys

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and update it with your Supabase credentials and other required environment variables.

5. **Generate Prisma Client**

   ```bash
   bunx prisma generate
   ```

6. **Start the development server**

   ```bash
   bun run dev
   ```

7. **Access the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/          # Prisma schema and migrations
├── public/          # Static assets
├── src/             # Application source code
├── .env             # Environment variables (create from .env.example)
├── .env.example     # Example environment variables
└── README.md        # This file
```

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the application for production
- `bun run start` - Run the built application

## Database Management

This project uses Prisma ORM to interact with the Supabase PostgreSQL database:

- `bunx prisma studio` - Open Prisma Studio to manage your database
- `bunx prisma migrate dev` - Create migrations from your Prisma schema changes
- `bunx prisma db push` - Push schema changes directly to the database

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE) or whichever license you prefer.

## Support

For any questions or issues, please open an issue in the repository or contact the repository maintainer.
