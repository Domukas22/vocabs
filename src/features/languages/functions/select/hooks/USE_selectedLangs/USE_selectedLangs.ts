//
//
//

import Language_MODEL from "@/src/db/models/Language_MODEL";
import { useState, useEffect } from "react";
import { FETCH_langs } from "@/src/features/languages/functions";

export function USE_selectedLangs({
  lang_ids,
  onSelect,
}: {
  lang_ids: string[];
  onSelect?: () => void;
}) {
  const [selected_LANGS, SET_selectedLangs] = useState<Language_MODEL[]>([]);

  function SELECT_lang(incoming_LANG: Language_MODEL) {
    const alreadyHasLang = selected_LANGS?.some(
      (l) => l.lang_id === incoming_LANG.lang_id
    );

    if (!alreadyHasLang) {
      // add new lang
      SET_selectedLangs((prev) => [incoming_LANG, ...prev]);
    } else {
      SET_selectedLangs((prev) =>
        prev.filter((lang) => lang?.lang_id !== incoming_LANG.lang_id)
      );
    }
    if (onSelect) onSelect();
  }

  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const langs = await FETCH_langs({ lang_ids });
        SET_selectedLangs(langs);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLangs();
  }, [lang_ids]);

  return { selected_LANGS, SELECT_lang };
}
