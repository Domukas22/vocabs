import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";
import { Language_MODEL, List_MODEL, Vocab_MODEL } from "./watermelon_MODELS";
import { json } from "@nozbe/watermelondb/decorators";
import languages from "../constants/languages";

// Using built-in SyncLogger
let isSyncing = false; // Flag to indicate if a sync is already in progress

export async function sync() {
  // Check if a sync is already in progress
  if (isSyncing) return;

  // Set the flag to indicate that sync is in progress
  isSyncing = true;

  try {
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
          ...data.changes,
          lists: TURN_listLangIdsIntoJson(data.changes.lists),
          vocabs: TURN_VocabtrsIntoJson(data.changes.vocabs),
          languages: TURN_langExampleHighlights(data.changes.languages),
          // languages: TURN_VocabtrsIntoJson(data.changes.vocabs),
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
  } catch (error) {
    console.error("🔴 Sync error: 🔴", error);
  } finally {
    // Reset the flag after sync operation finishes
    isSyncing = false;
  }
}

function TURN_listLangIdsIntoJson(lists: {
  created?: List_MODEL[];
  updated?: List_MODEL[];
  deleted?: string[];
}) {
  return {
    ...lists,
    updated:
      lists.updated?.map((list) => ({
        ...list,
        default_lang_ids: JSON.stringify(list.default_lang_ids), // Convert array to JSON string
        collected_lang_ids: JSON.stringify(list.collected_lang_ids), // Convert array to JSON string
      })) || [], // Default to an empty array if undefined
    created:
      lists.created?.map((list) => ({
        ...list,
        default_lang_ids: JSON.stringify(list.default_lang_ids), // Convert array to JSON string
        collected_lang_ids: JSON.stringify(list.collected_lang_ids), // Convert array to JSON string
      })) || [], // Default to an empty array if undefined
  };
}
function TURN_langExampleHighlights(languages: {
  created?: Language_MODEL[];
  updated?: Language_MODEL[];
  deleted?: string[];
}) {
  return {
    ...languages,
    updated:
      languages.updated?.map((list) => ({
        ...list,
        translation_example_highlights: JSON.stringify(
          list.translation_example_highlights
        ),
      })) || [],
    created:
      languages.created?.map((list) => ({
        ...list,
        translation_example_highlights: JSON.stringify(
          list.translation_example_highlights
        ),
      })) || [],
  };
}
function TURN_VocabtrsIntoJson(vocabs: {
  created?: Vocab_MODEL[];
  updated?: Vocab_MODEL[];
  deleted?: string[];
}) {
  return {
    ...vocabs,
    updated:
      vocabs.updated?.map((vocab) => ({
        ...vocab,
        trs: JSON.stringify(vocab.trs), // Convert trs array to JSON string
      })) || [], // Default to an empty array if undefined
    created:
      vocabs.created?.map((vocab) => ({
        ...vocab,
        trs: JSON.stringify(vocab.trs), // Convert trs array to JSON string
      })) || [], // Default to an empty array if undefined
  };
}
