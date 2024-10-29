///
import { useEffect, useMemo, useState } from "react";
import { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q, Query } from "@nozbe/watermelondb";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import FetchVocabs_QUERY from "../../2_vocabs/utils/FetchVocabs_QUERY";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export default function USE_observedVocabs({
  search,
  user_id,
  list_id,
  z_vocabDisplay_SETTINGS,
  fetchAll = false,
}: {
  search: string;
  list_id?: string | undefined;
  user_id?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  fetchAll?: boolean;
}) {
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[] | undefined>(undefined);

  useEffect(() => {
    const quries = FetchVocabs_QUERY({
      search,
      list_id,
      user_id,
      z_vocabDisplay_SETTINGS,
      fetchAll,
    });
    const query = quries.observe();

    const subscription = query.subscribe({
      next: (updated_VOCABS) => {
        SET_vocabs(updated_VOCABS?.length > 0 ? updated_VOCABS : undefined); // Set the first item or undefined if empty
      },
    });

    // No need for explicit unsubscribe; Watermelon handles this
    return () => subscription.unsubscribe(); // Clean up the subscription
  }, [search, list_id, z_vocabDisplay_SETTINGS]);

  return vocabs;
}
