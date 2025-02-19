import { synchronize } from "@nozbe/watermelondb/sync";
import db from "../../db/index";
import { supabase } from "../../lib/supabase";
import User_MODEL from "@/src/db/models/User_MODEL";
import { useState } from "react";

import { Error_PROPS } from "../../types/error_TYPES";
import { CREATE_internalErrorMsg } from "../../constants/globalVars";
import ADJUST_pullChangesData from "./utils/ADJUST_pullChangesData";
import {
  NEW_timestampWithTimeZone,
  SEND_internalError,
  CHECK_ifNetworkFailure,
} from "@/src/utils";
import { GET_targetDate } from "./utils/GET_targetDate";
import { USE_zustand } from "../zustand/USE_zustand/USE_zustand";

const defaultError_MSG =
  "Something went wrong when trying to synchronize data. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

let isSyncing = false; // Flag to indicate if a sync is already in progress

const emptyChanges_OBJ = {
  lists: { updated: [], created: [], deleted: [] },
  users: { updated: [], created: [], deleted: [] },
  vocabs: { updated: [], created: [], deleted: [] },
  notifications: { updated: [], created: [], deleted: [] },
  contact_messages: { updated: [], created: [], deleted: [] },
  payments: { updated: [], created: [], deleted: [] },
  languages: { updated: [], created: [], deleted: [] },
};

interface Sync_PROPS {
  user: User_MODEL | undefined;
  PULL_EVERYTHING?: boolean;
}

const internal_ERROR = {
  msg: CREATE_internalErrorMsg("trying to syncronize this list for publishing"),
  type: "internal",
};
const networkFailure_RESPONSE = {
  msg: "There seems to be an issue with your internet connection.",
  type: "user",
};

export function USE_sync() {
  const [IS_syncing, SET_syncing] = useState(false);
  const { z_SET_user } = USE_zustand();
  const [success, SET_success] = useState(false);
  const [error, SET_error] = useState<Error_PROPS>();

  const sync = async (data: Sync_PROPS) => {
    if (IS_syncing) return;

    const { user, PULL_EVERYTHING = false } = data;

    try {
      SET_syncing(true);
      SET_success(false);
      SET_error(undefined);

      if (!user || !user?.id) {
        SEND_internalError({
          message: `User object undefined when trying to sync`,
          function_NAME: "USE_sync --> sync",
        });
        SET_error(internal_ERROR);
        return;
      }

      await synchronize({
        database: db,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
          // fetch updates from supabase
          // if 'PULL_EVERYTHING' is true, fetch everything
          const { data: changes, error } = await supabase.rpc("pull", {
            userid: user?.id,
            _last_pulled_at: GET_targetDate({ PULL_EVERYTHING, user }),
          });

          // in case supabase fetch returns error
          if (error) {
            // is the supabase error a network failure?
            const IS_networkFailure = CHECK_ifNetworkFailure(error);
            if (IS_networkFailure) {
              SET_error(networkFailure_RESPONSE);
              throw new Error();
            }

            // if not a network failure
            SEND_internalError({
              message: `Supabase pull sync failed`,
              function_NAME:
                "USE_sync --> pullChanges --> supabase.rpc('pull'...",
              details: error,
            });

            SET_error(internal_ERROR);
            throw new Error(
              `🔴 Supabase pull sync failed 🔴: ${error.message}`
            );
          }

          const updated_USER = await user?.UPDATE_lastPulledAt();

          if (updated_USER) {
            z_SET_user(updated_USER);
          } else {
            SEND_internalError({
              message: `updated_USER from WatermelonDB returned undefined when trying to updated last_pulled_at while syncing`,
              function_NAME:
                "USE_sync --> pullChanges --> user.UPDATE_lastPulledAt()",
            });

            SET_error(internal_ERROR);
            throw new Error(
              `🔴 Failed to update users last_pulled_at when syncing with USE_sync 🔴`
            );
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
            const IS_networkFailure = CHECK_ifNetworkFailure(error);
            if (IS_networkFailure) {
              SET_error(networkFailure_RESPONSE);
              throw new Error(
                `🔴 There seems to be a problem with your internet connection`
              );
            }

            SEND_internalError({
              message: `Supabase push sync failed`,
              function_NAME:
                "USE_sync --> pushChanges --> supabase.rpc('push'...",
              details: error,
            });
            SET_error(internal_ERROR);
            throw new Error(
              `🔴 Supabase push sync failed 🔴: ${error.message}`
            );
          }
        },
        migrationsEnabledAtVersion: 1,
        sendCreatedAsUpdated: true,
      });

      SET_success(true);
    } catch (err: any) {
      const IS_networkFailure = CHECK_ifNetworkFailure(err);
      if (IS_networkFailure) {
        SET_error(networkFailure_RESPONSE);
        return;
      }

      SEND_internalError({
        message: `Sync failed`,
        function_NAME: "USE_sync --> sync",
        details: err,
      });
      SET_error(internal_ERROR);
    } finally {
      SET_syncing(false);
    }
  };

  return {
    sync,
    IS_syncing,
    sync_SUCCESS: success,
    sync_ERROR: error,
  };
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

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
    return { success: false, message: "🔴 PUSH_changes error: 🔴", error };
  } finally {
    // Reset the flag after sync operation finishes
    isSyncing = false;
  }
}
