import { synchronize } from "@nozbe/watermelondb/sync";
import db from "./index";
import { supabase } from "../lib/supabase";
import {
  Language_MODEL,
  List_MODEL,
  User_MODEL,
  Vocab_MODEL,
} from "./watermelon_MODELS";
import { json } from "@nozbe/watermelondb/decorators";
import languages from "../constants/languages";
import { hasUnsyncedChanges } from "@nozbe/watermelondb/sync";
import { useState } from "react";
import USE_error from "../hooks/USE_error";
import NEW_timestampWithTimeZone from "../utils/NEW_timestampWithTimeZone";
import CONVERT_TimestampzToReadableDate from "../utils/CONVERT_TimestampzToReadableDate";
import USE_zustand from "../zustand";
import { useRouter } from "expo-router";
import TURN_VocabtrsIntoJson from "./utils/TURN_VocabtrsIntoJson";
import TURN_langExampleHighlightsIntoJson from "./utils/TURN_langExampleHighlightsIntoJson";

const defaultError_MSG =
  "Something went wrong when trying to synchronize data. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

// Using built-in SyncLogger
let isSyncing = false; // Flag to indicate if a sync is already in progress

interface Pull_PROPS {
  user: User_MODEL | undefined;
  pull_type: "all" | "updates";
}

const emptyChanges_OBJ = {
  lists: { updated: [], created: [], deleted: [] },
  users: { updated: [], created: [], deleted: [] },
  vocabs: { updated: [], created: [], deleted: [] },
  notifications: { updated: [], created: [], deleted: [] },
  contact_messages: { updated: [], created: [], deleted: [] },
  payments: { updated: [], created: [], deleted: [] },
  languages: { updated: [], created: [], deleted: [] },
};

export function USE_sync_2() {
  const [IS_syncing, SET_syncing] = useState(false);
  const { z_user, z_SET_user } = USE_zustand();

  const {
    HAS_error,
    userError_MSG,
    HAS_internalError,
    CREATE_error,
    RESET_error,
  } = USE_error();

  const sync = async ({ PULL_EVERYTHING = false }) => {
    if (IS_syncing) return;
    RESET_error();

    if (!z_user || !z_user?.id)
      return CREATE_error({
        userError_MSG: defaultError_MSG,
        internalError_MSG:
          "🔴 User object undefined when syncing with USE_sync_2 🔴",
      });

    try {
      SET_syncing(true);

      await synchronize({
        database: db,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
          const targetPull_DATE = z_user?.last_pulled_at
            ? z_user.last_pulled_at
            : NEW_timestampWithTimeZone();

          const { data: changes, error } = await supabase.rpc("pull_boss", {
            userid: z_user?.id,
            _last_pulled_at: targetPull_DATE,
          });

          if (error) {
            // set internal sentry error
            CREATE_error({
              userError_MSG: defaultError_MSG,
              internalError_MSG: `🔴 Something went wrong with supabase 'pull' function when syncing with USE_sync_2 🔴: ${error.message}`,
            });
            throw new Error(); // stops watermelon from clearing the "changes" object
          }

          const updated_USER = await z_user.UPDATE_lastPulledAt();
          if (updated_USER) {
            z_SET_user(updated_USER);
          }

          const updatedChanges = ADJUST_pullChangesData(changes);

          return {
            changes: updatedChanges,
            timestamp: Date.now(),
          };
        },

        pushChanges: async ({ changes, lastPulledAt }) => {
          const { error } = await supabase.rpc("push", {
            changes,
          });

          if (error) {
            CREATE_error({
              userError_MSG: defaultError_MSG,
              internalError_MSG: `🔴 Something went wrong with supabase 'push' function when syncing with USE_sync_2 🔴: ${error.message}`,
            });
            throw new Error(); // stops watermelon from clearing the "changes" object
          }
        },
        migrationsEnabledAtVersion: 1,
        sendCreatedAsUpdated: true,
      });
    } catch (error: any) {
      const networkErrorMsg = // this isnt really necessary when we are working with local functions. Use this only with online functions
        "It looks like there's an issue with your internet connection. Please check and try again.";
      const errorMessage =
        error?.message === "Failed to fetch"
          ? networkErrorMsg
          : defaultError_MSG;
      const internalMessage =
        error?.message !== "Failed to fetch"
          ? `🔴 Unexpected error when syncing with USE_sync_2: 🔴 ${error?.message}`
          : undefined;

      CREATE_error({
        userError_MSG: errorMessage,
        internalError_MSG: internalMessage,
      });
    } finally {
      SET_syncing(false);
    }
  };

  return {
    sync,
    HAS_syncError: HAS_error,
    userSyncError_MSG: userError_MSG,
    HAS_internalSyncError: HAS_internalError,
    RESET_syncError: RESET_error,
  };
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

function ADJUST_pullChangesData(changes: any) {
  const updatedChanges = {
    ...changes,
    vocabs: TURN_VocabtrsIntoJson(changes.vocabs),
    languages: TURN_langExampleHighlightsIntoJson(changes.languages),
  };

  return updatedChanges;
}

export async function PUSH_changes() {
  if (isSyncing) {
    return { success: false };
  }

  isSyncing = true;

  try {
    // TODO: when making updates, create a fucntion PUSH_updates, which simply pushes the created/update/deleted things, without having to pull anything
    await synchronize({
      database: db,
      pullChanges: async () => {
        return {
          changes: { ...emptyChanges_OBJ },
          timestamp: Date.now(),
        };
      },

      pushChanges: async ({ changes }) => {
        const { error } = await supabase.rpc("push", {
          changes,
        });

        if (error) {
          console.error("🔴 Push error: 🔴", error?.message);
          throw new Error(); // this will stop watermelon from clearing the "changes" object
        }
      },
      migrationsEnabledAtVersion: 1,
      sendCreatedAsUpdated: true,
    });
    return { success: true };
  } catch (error) {
    return { success: false, internal_MSG: "🔴 PUSH_changes error: 🔴", error };
  } finally {
    // Reset the flag after sync operation finishes
    isSyncing = false;
  }
}

export async function checkUnsyncedChanges() {
  const database = db;
  const x = await hasUnsyncedChanges({ database });
}
