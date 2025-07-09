# subtle

Subtle is the productivity application that I needed in my life to make everything I do easier.

I plan to create integrations with

GitHub
Azure Devops

and I plan to make a CLI and a super compact mode potentially adding the ability to use a webhook as well



---

# Development

This application use Drizzle ORM for creating the database schema.
To initialize the database for development run

```bash
npx drizzle-kit generate && npx drizzle-kit migrate
```

After that you can run `pnpm dev` and run the application
