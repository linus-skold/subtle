import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import * as schema from './schema/index.schema.js'; // Adjust the path as necessary


const database = new Database('com.subtle.db');
const client = drizzle(database, { schema });

export const getClient = () => {
  return client;
};

