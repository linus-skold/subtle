import Database from "@tauri-apps/plugin-sql";

let database: Database;
export const setDatabase = async () => {
  const db = await Database.load("sqlite:subtle-todo.db");
  database = db;
};

export const getDatabase = () => {
  return database;
};
