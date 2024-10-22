import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";
import { List_MODEL, Vocab_MODEL } from "./watermelon_MODELS";
import { json } from "@nozbe/watermelondb/decorators";

// Using built-in SyncLogger

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

      const updatedChanges = {
        // for some reason the pull_lists function retunrs an array for the default_lang_ids instead of a json string
        // this chunk simply converts the default_lang_ids array into json format
        ...data.changes,
        lists: {
          ...data.changes.lists,
          updated: data.changes.lists.updated.map((list: List_MODEL) => ({
            ...list,
            default_lang_ids: JSON.stringify(list.default_lang_ids), // Convert array to JSON string
          })),
        },
        vocabs: {
          ...data.changes.vocabs,
          updated: data.changes.vocabs.updated.map((vocab: Vocab_MODEL) => ({
            ...vocab,
            trs: JSON.stringify(vocab.trs), // Convert trs array to JSON string
          })),
        },
      };
      return { changes: updatedChanges, timestamp: data.timestamp };
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
