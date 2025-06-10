import Database from 'better-sqlite3';

let database: Database.Database;

export const setupDatabase = () => {
  database = new Database("subtle-todo.db", {});
  
};

export const getDatabase = () => {
  return database;
};
