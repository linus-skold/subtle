import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema',
  out: './drizzle/migrations',
  dbCredentials: {
    url: 'file:./com.subtle.db', // Adjust the path as necessary
  },
})
