import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";

// Sync function to pull and push changes
export async function syncDatabase() {
  // await synchronize();
}

// TODO ==> What if UUID already exists?

// Higher-level function to execute synchronization
export async function executeSync() {
  try {
    await syncDatabase();
  } catch (error) {
    console.error("Sync failed:", error);
    // Optionally implement retry logic or inform the user
  }
}
