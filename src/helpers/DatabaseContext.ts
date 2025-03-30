import React from "react";
import Database from "@tauri-apps/plugin-sql";


export const DatabaseContext = React.createContext<Database | null>(null);
