import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";

export async function mySync() {
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
        console.log("🟢 Pulled all 🟢");
      }

      return { changes: data.changes, timestamp: data.timestamp };
    },

    // Perhaods i should hav einly a single push function.
    // In case osomethign fails ,ethe entire push operation stops.
    // Right now, lists might push in, but vocabs might have an error and not push
    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error: listPush_ERROR } = await supabase.rpc("push_lists", {
        changes,
      });

      if (listPush_ERROR && listPush_ERROR?.message) {
        console.error("🔴 List push error: 🔴", listPush_ERROR?.message);
      } else {
        console.log("🟢 Pushed lists 🟢");
      }

      const { error: vocabPush_ERROR } = await supabase.rpc("push_vocabs", {
        changes,
      });

      if (vocabPush_ERROR && vocabPush_ERROR?.message) {
        console.error("🔴 Vocab push error: 🔴", vocabPush_ERROR?.message);
      } else {
        console.log("🟢 Pushed vocabs 🟢");
      }

      // const response = await fetch(`https://my.backend/sync?last_pulled_at=${lastPulledAt}`, {
      //   method: 'POST',
      //   body: JSON.stringify(changes),
      // })
      // if (!response.ok) {
      //   throw new Error(await response.text())
      // }
    },
    migrationsEnabledAtVersion: 1,
    sendCreatedAsUpdated: true,
  });
}
