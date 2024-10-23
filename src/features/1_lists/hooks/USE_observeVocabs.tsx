///
import { useEffect, useMemo, useState } from "react";
import { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q, Query } from "@nozbe/watermelondb";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import FetchVocabs_QUERY from "../../2_vocabs/utils/FetchVocabs_QUERY";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { DisplaySettings_PROPS } from "@/src/zustand";

export default function USE_observedVocabs({
  search,
  list_id,
  z_display_SETTINGS,
}: {
  search: string;
  list_id: string | undefined;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
}) {
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[] | undefined>(undefined);

  useEffect(() => {
    const quries = FetchVocabs_QUERY({ search, list_id, z_display_SETTINGS });
    const query = quries.observe();

    const subscription = query.subscribe({
      next: (updated_VOCABS) => {
        SET_vocabs(updated_VOCABS?.length > 0 ? updated_VOCABS : undefined); // Set the first item or undefined if empty
      },
    });

    // No need for explicit unsubscribe; Watermelon handles this
    return () => subscription.unsubscribe(); // Clean up the subscription
  }, [search, list_id, z_display_SETTINGS]);

  return vocabs;
}
