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
  z_langs: Lang_TYPE[];
  z_langsLoading_STATE: loadingState_TYPES;
  z_langs_ERROR?: General_ERROR;

  z_INSERT_fetchedLangs: (langs: Lang_TYPE[]) => void;
  z_INSERT_langsError: (error: General_ERROR) => void;
  z_SEARCH_langs: (search_VAL: string) => Lang_TYPE[];
  z_GET_langsByLangId: (lang_IDs: string[]) => Lang_TYPE[];
};

export const z_USE_langs = create<z_USE_langs_PROPS>((set, get) => ({
  z_langs: [],
  z_langsLoading_STATE: "none",
  z_langs_ERROR: undefined,

  z_INSERT_fetchedLangs: (langs) => set({ z_langs: langs }),
  z_INSERT_langsError: (error) =>
    set({
      z_langs: [],
      z_langsLoading_STATE: "error",
      z_langs_ERROR: error,
    }),
  z_SEARCH_langs: (search_VAL: string) => {
    const searched_LANGS = get().z_langs?.filter((lang) =>
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
    );
    return searched_LANGS;
  },
  z_GET_langsByLangId: (lang_IDs) =>
    get().z_langs?.filter((lang) =>
      lang_IDs.some((lang_ID) => lang_ID === lang.lang_id)
    ),
}));
