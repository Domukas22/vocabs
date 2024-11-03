import { useState, useEffect } from "react";
import { User_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import { Lists_DB } from "@/src/db";

export default function USE_collectMyListLangs(user: User_MODEL | undefined) {
  const [collectedLang_IDS, setCollectedLang_IDS] = useState<string[]>([]);

  useEffect(() => {
    // If no user or lists, exit early
    if (!user) return;

    const query = Lists_DB.query(
      Q.where("deleted_at", Q.eq(null)),
      Q.where("user_id", user?.id || "")
    ).observe();

    // Subscription to track updates
    const subscription = query.subscribe({
      next: (updatedLists) => {
        // Collect all `collected_lang_ids` from the lists
        const allLangIds = updatedLists.flatMap((list) =>
          list.collected_lang_ids ? list.collected_lang_ids.split(",") : []
        );

        // Get unique language IDs
        const uniqueLangIds = Array.from(new Set(allLangIds));

        // Update state
        setCollectedLang_IDS(uniqueLangIds);
      },
    });

    // Clean up the subscription
    return () => subscription.unsubscribe();
  }, [user]);

  return collectedLang_IDS;
}
