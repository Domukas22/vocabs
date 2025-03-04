//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { create } from "zustand";
import { Lang_TYPE } from "../../../types";

export type z_INSERT_langsError_TYPE = (error: General_ERROR) => void;

//////////////////////////////////////////////////////////////

type z_USE_langs_PROPS = {
  z_langs: Record<string, Lang_TYPE>; // Now an object indexed by lang_id
  z_langsLoading_STATE: loadingState_TYPES;
  z_langs_ERROR?: General_ERROR;

  z_INSERT_fetchedLangs: (langs: Lang_TYPE[]) => void;
  z_INSERT_langsError: (error: General_ERROR) => void;
  z_SEARCH_langs: (search_VAL: string) => Lang_TYPE[];
  z_GET_langsByLangId: (lang_IDs: string[]) => Lang_TYPE[];
  z_GET_oneLangById: (targetLang_ID: string) => Lang_TYPE | undefined;
};

export const z_USE_langs = create<z_USE_langs_PROPS>((set, get) => ({
  z_langs: {}, // Now an object instead of an array/set
  z_langsLoading_STATE: "none",
  z_langs_ERROR: undefined,

  z_INSERT_fetchedLangs: (langs) =>
    set({
      z_langs: langs.reduce((acc, lang) => {
        acc[lang.lang_id] = lang;
        return acc;
      }, {} as Record<string, Lang_TYPE>),
    }),

  z_INSERT_langsError: (error) =>
    set({
      z_langs: {},
      z_langsLoading_STATE: "error",
      z_langs_ERROR: error,
    }),

  z_SEARCH_langs: (search_VAL: string) =>
    Object.values(get().z_langs).filter((lang) =>
      (
        [
          "lang_in_en",
          "lang_in_de",
          "country_in_en",
          "country_in_de",
          "lang_id",
        ] as (keyof Lang_TYPE)[]
      ).some((key) => {
        const value = lang[key];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(search_VAL.toLowerCase())
        );
      })
    ),

  z_GET_langsByLangId: (lang_IDs) =>
    lang_IDs.map((id) => get().z_langs[id]).filter(Boolean) as Lang_TYPE[], // Fetch directly from object

  z_GET_oneLangById: (targetLang_ID) => get().z_langs[targetLang_ID], // O(1) lookup
}));
