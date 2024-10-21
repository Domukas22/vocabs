import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";

export async function sync() {
  await synchronize({
    database: db,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const { data, error: pull_ERROR } = await supabase.rpc("pull_all", {
        schema_version: schemaVersion,
        migration,
        last_pulled_at: lastPulledAt,
      });

      if (pull_ERROR && pull_ERROR?.message) {
        console.error("🔴 Pull error: 🔴", pull_ERROR?.message);
      } else {
      }

      return { changes: data.changes, timestamp: data.timestamp };
    },

    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.rpc("push_all", {
        changes,
      });

      if (error && error?.message) {
        console.error("🔴 Push error: 🔴", error?.message);
      } else {
      }
    },
    migrationsEnabledAtVersion: 1,
    sendCreatedAsUpdated: true,
  });
}
