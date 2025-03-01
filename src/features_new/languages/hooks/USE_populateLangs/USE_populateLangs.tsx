//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_langs } from "../../functions/fetch/FETCH_langs/FETCH_langs";
import { z_USE_langs } from "../zustand/z_USE_langs/z_USE_langs";
import { SEND_internalError } from "@/src/utils";

const function_NAME = "USE_populateLangs";

export default function USE_populateLangs() {
  const { z_INSERT_fetchedLangs } = z_USE_langs();

  const POPULATE_langs = async () => {
    try {
      const { langs } = await FETCH_langs();

      if (!langs)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_langs' returned an undefined 'langs' array, although no error was thrown",
        });

      z_INSERT_fetchedLangs(langs);
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      SEND_internalError(err);
      throw err;
      // 🔴🔴 TODO ==> Do something?
    }
  };

  return { POPULATE_langs };
}
