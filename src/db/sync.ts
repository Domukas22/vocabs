import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";

// Sync function to pull and push changes
export async function syncDatabase() {
  await synchronize({
    database: db,

    // Pull changes from Supabase
    pullChanges: async ({ lastPulledAt }) => {
      // Pull changes for users
      const { data: usersData, error: usersError } = await supabase.rpc(
        "pull_user",
        {
          last_pulled_at: lastPulledAt,
        }
      );
      if (usersError) {
        throw new Error(usersError.message);
      }

      // Pull changes for languages (if needed in the future)
      const { data: languagesData, error: languagesError } = await supabase.rpc(
        "pull_languages",
        {
          last_pulled_at: lastPulledAt,
        }
      );
      if (languagesError) {
        throw new Error(languagesError.message);
      }

      // Pull changes for lists
      const { data: listsData, error: listsError } = await supabase.rpc(
        "pull_user_lists",
        {
          last_pulled_at: lastPulledAt,
        }
      );
      if (listsError) {
        throw new Error(listsError.message);
      }

      // Pull changes for vocabs
      const { data: vocabsData, error: vocabsError } = await supabase.rpc(
        "pull_user_vocabs",
        {
          last_pulled_at: lastPulledAt,
        }
      );
      if (vocabsError) {
        throw new Error(vocabsError.message);
      }

      // Pull changes for translations
      const { data: translationsData, error: translationsError } =
        await supabase.rpc("pull_user_translations", {
          last_pulled_at: lastPulledAt,
        });
      if (translationsError) {
        throw new Error(translationsError.message);
      }

      // Combine all changes
      const changes = {
        users: usersData.changes,
        languages: languagesData.changes,
        lists: listsData.changes,
        vocabs: vocabsData.changes,
        translations: translationsData.changes,
      };

      // Use the latest timestamp from the last successful pull
      const timestamp = Math.max(
        usersData.timestamp,
        languagesData.timestamp,
        listsData.timestamp,
        vocabsData.timestamp,
        translationsData.timestamp
      );

      return { changes, timestamp };
    },

    // Push changes to Supabase
    pushChanges: async ({ changes }) => {
      // Push changes for users
      const { error: usersPushError } = await supabase.rpc("push_user", {
        changes: changes.users,
      });
      if (usersPushError) {
        throw new Error(usersPushError.message);
      }

      // Push changes for lists
      const { error: listsPushError } = await supabase.rpc("push_user_lists", {
        changes: changes.lists,
      });
      if (listsPushError) {
        throw new Error(listsPushError.message);
      }

      // Push changes for vocabs
      const { error: vocabsPushError } = await supabase.rpc(
        "push_user_vocabs",
        { changes: changes.vocabs }
      );
      if (vocabsPushError) {
        throw new Error(vocabsPushError.message);
      }

      // Push changes for translations
      const { error: translationsPushError } = await supabase.rpc(
        "push_user_translations",
        { changes: changes.translations }
      );
      if (translationsPushError) {
        throw new Error(translationsPushError.message);
      }

      // Note: Languages are not pushed from the app, so we skip them
    },

    // Ensure that new records are pushed as updates
    sendCreatedAsUpdated: true,
  });
}

// Higher-level function to execute synchronization
export async function executeSync() {
  try {
    await syncDatabase();
  } catch (error) {
    console.error("Sync failed:", error);
    // Optionally implement retry logic or inform the user
  }
}
