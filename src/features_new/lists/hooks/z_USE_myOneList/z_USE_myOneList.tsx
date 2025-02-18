//
//
//

import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { ARE_listVocabDifficultiesBeingReset } from "../../functions/update/resetDifficulties/ARE_listVocabDifficultiesBeingReset/ARE_listVocabDifficultiesBeingReset";
import { RESET_allDifficultiesOfAList } from "../../functions/update/resetDifficulties/RESET_allDifficultiesOfAList/RESET_allDifficultiesOfAList";
import { SEND_internalError } from "@/src/utils";
import { IS_myOneListNameUpdating } from "../../functions/update/name/IS_myOneListNameUpdating/IS_myOneListNameUpdating";
import { UPDATE_listName } from "../../functions/update/name/UPDATE_myOneListName/UPDATE_myOneListName";
import { t } from "i18next";
import { IS_myOneListDeleting } from "../../functions/delete/IS_myOneListDeleting/IS_myOneListDeleting";
import { DELETE_list } from "../../functions/delete/DELETE_list/DELETE_list";
import { FETCH_oneList } from "../../functions/fetch/FETCH_oneList/FETCH_oneList";
import { ARE_myOneListDefaultLangIdsUpdating } from "../../functions/update/defaultLangIds/ARE_myOneListDefaultLangIdsUpdating/ARE_myOneListDefaultLangIdsUpdating";
import { UPDATE_listDefaultLangIds } from "../../functions/update/defaultLangIds/UPDATE_listDefaultLangIds/UPDATE_listDefaultLangIds";

export interface myOneListAction_TYPE {
  list_id: string;
  action:
    | "deleting"
    | "updating_name"
    | "resetting_difficulties"
    | "updating_default_lang_ids";
}

export type z_FETCH_myOneListrgument_TYPES = {};

type z_USE_myOneList_PROPS = {
  z_myOneList: List_TYPE | undefined;
  z_myOneListCurrent_ACTIONS: myOneListAction_TYPE[];

  z_IS_myOneListFetching: boolean;

  z_RESET_allVocabDifficultiesOfMyOneList: (
    list_id: string,
    user_id: string,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;

  z_UPDATE_myOneListName: (
    list_id: string,
    user_id: string,
    new_NAME: string,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;

  z_DELETE_myOneList: (
    list_id: string,
    user_id: string,

    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_FETCH_myOneListById: (
    list_id: string,
    user_id: string,

    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_UPDATE_myOneListDefaultLangIds: (
    list_id: string,
    user_id: string,
    newLang_IDs: string[],
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;

  z_SET_myOneList: (list: List_TYPE) => void;

  z_IS_myOneListNameHighlighted: boolean;
  highlightTimeout_ID: any;
  z_HIGHLIGHT_myOneListName: () => void;
};

export const z_USE_myOneList = create<z_USE_myOneList_PROPS>((set, get) => ({
  z_myOneList: undefined,
  z_myOneListCurrent_ACTIONS: [],
  z_IS_myOneListFetching: false,

  z_RESET_allVocabDifficultiesOfMyOneList: async (
    list_id,
    user_id,
    sideEffects
  ) => {
    const function_NAME = "z_RESET_allVocabDifficultiesOfMyOneList";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (
      ARE_listVocabDifficultiesBeingReset(
        list_id,
        get().z_myOneListCurrent_ACTIONS
      )
    )
      return;

    // ----------------------------------------
    try {
      set({
        z_myOneListCurrent_ACTIONS: [
          ...get().z_myOneListCurrent_ACTIONS,
          { action: "resetting_difficulties", list_id },
        ],
      });
      // ----------------------------------------

      await RESET_allDifficultiesOfAList(list_id, user_id);

      set({
        z_myOneListCurrent_ACTIONS: get().z_myOneListCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "resetting_difficulties" &&
            action.list_id !== list_id
        ),
      });

      onSuccess();

      // ----------------------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },
  z_UPDATE_myOneListName: async (list_id, user_id, new_NAME, sideEffects) => {
    const function_NAME = "z_UPDATE_myOneListName";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (IS_myOneListNameUpdating(list_id, get().z_myOneListCurrent_ACTIONS))
      return;

    // ----------------------------------------
    try {
      // If the provided name is the same
      if (new_NAME === get().z_myOneList?.name) {
        onSuccess();
        return;
      }

      if (!new_NAME)
        throw new FormInput_ERROR({
          user_MSG: t("error.correctErrorsAbove"),
          falsyForm_INPUTS: [
            { input_NAME: "name", message: t("error.provideAListName") },
          ],
        });

      set({
        z_myOneListCurrent_ACTIONS: [
          ...get().z_myOneListCurrent_ACTIONS,
          { action: "updating_name", list_id },
        ],
      });

      const { updated_LIST } = await UPDATE_listName(
        list_id,
        user_id,
        new_NAME
      );

      if (!updated_LIST)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_listName' returned undefined 'updated_LIST', although no error was thrown",
        });
      // ----------------------------------------

      set({
        z_myOneList: updated_LIST,
        z_myOneListCurrent_ACTIONS: get().z_myOneListCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "updating_name" && action.list_id !== list_id
        ),
      });
      onSuccess();

      // ----------------------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },
  z_DELETE_myOneList: async (list_id, user_id, sideEffects) => {
    const function_NAME = "z_DELETE_myOneList";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (IS_myOneListDeleting(list_id, get().z_myOneListCurrent_ACTIONS)) return;

    // ----------------------------------------
    try {
      set({
        z_myOneListCurrent_ACTIONS: [
          ...get().z_myOneListCurrent_ACTIONS,
          { action: "deleting", list_id },
        ],
      });

      await DELETE_list(list_id, user_id);

      // ----------------------------------------
      // First, naviate back, then remove the one list state
      onSuccess();
      set({
        z_myOneList: undefined,
        z_myOneListCurrent_ACTIONS: get().z_myOneListCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "updating_name" && action.list_id !== list_id
        ),
      });

      // ----------------------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },
  z_FETCH_myOneListById: async (list_id, user_id, sideEffects) => {
    const function_NAME = "z_DELETE_myOneList";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (get().z_IS_myOneListFetching) return;

    // ----------------------------------------
    try {
      set({ z_IS_myOneListFetching: true });

      const { list } = await FETCH_oneList(list_id, user_id);

      if (!list)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_oneList' returned undefined 'list', although no error was thrown",
        });

      // ----------------------------------------
      // First, naviate back, then remove the one list state
      onSuccess();
      set({ z_myOneList: list });

      // ----------------------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    } finally {
      set({ z_IS_myOneListFetching: false });
    }
  },
  z_UPDATE_myOneListDefaultLangIds: async (
    list_id,
    user_id,
    newLang_IDs,
    sideEffects
  ) => {
    const function_NAME = "z_UPDATE_myOneListDefaultLangIds";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (
      ARE_myOneListDefaultLangIdsUpdating(
        list_id,
        get().z_myOneListCurrent_ACTIONS
      )
    )
      return;

    // ----------------------------------------
    try {
      set({
        z_myOneListCurrent_ACTIONS: [
          ...get().z_myOneListCurrent_ACTIONS,
          { action: "updating_default_lang_ids", list_id },
        ],
      });

      const { updated_LIST } = await UPDATE_listDefaultLangIds(
        list_id,
        user_id,
        newLang_IDs
      );

      if (!updated_LIST)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_listDefaultLangIds' returned undefined 'updated_LIST', although no error was thrown",
        });
      // ----------------------------------------

      set({
        z_myOneList: updated_LIST,
        z_myOneListCurrent_ACTIONS: get().z_myOneListCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "updating_default_lang_ids" &&
            action.list_id !== list_id
        ),
      });
      onSuccess();

      // ----------------------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },

  z_SET_myOneList: (list: List_TYPE) => set({ z_myOneList: list }),

  z_IS_myOneListNameHighlighted: false,
  highlightTimeout_ID: "",
  z_HIGHLIGHT_myOneListName: () => {
    const currentTimeoutID = get().highlightTimeout_ID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_IS_myOneListNameHighlighted: true });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_IS_myOneListNameHighlighted: false });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ highlightTimeout_ID: timeoutID });
  },
}));
