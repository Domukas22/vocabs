import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import { useState, useEffect } from "react";
import FETCH_langs from "./FETCH_langs";

export default function USE_langs({
  lang_ids = [],
}: {
  lang_ids: string[] | undefined;
}) {
  const [selected_LANGS, SET_selectedLangs] = useState<Language_MODEL[]>([]);
  // if (!lang_ids || lang_ids?.length === 0) return [];

  useEffect(() => {
    (async () => {
      const langs = await FETCH_langs({ lang_ids });
      SET_selectedLangs(langs);
    })();
  }, [lang_ids]);

  return selected_LANGS;
}
