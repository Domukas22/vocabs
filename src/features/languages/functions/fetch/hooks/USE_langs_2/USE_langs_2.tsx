import { useEffect, useState, useMemo } from "react";
import { Q } from "@nozbe/watermelondb";
import { Languages_DB } from "@/src/db"; // Adjust the import based on your project structure
import Language_MODEL from "@/src/db/models/Language_MODEL";

interface USE_langs_PROPS {
  lang_ids?: string[];
  search?: string;
}

export function USE_langs_2({ lang_ids, search }: USE_langs_PROPS) {
  const [langs, SET_langs] = useState<Language_MODEL[]>([]);
  const [ARE_langsFetching, SET_langsFetching] = useState<boolean>(false);
  const [fetchLangs_ERROR, SET_fetchLangsError] = useState<string | null>(null);

  // Memoize the processed values of lang_ids and search
  const memoizedLangIds = useMemo(() => lang_ids, [lang_ids]);
  const memoizedSearch = useMemo(() => search?.trim(), [search]);

  useEffect(() => {
    const fetchLangs = async () => {
      SET_langsFetching(true);
      SET_fetchLangsError(null);

      try {
        let fetchedLangs: Language_MODEL[] = [];

        if (memoizedLangIds && Array.isArray(memoizedLangIds)) {
          // Fetch languages by lang_ids
          fetchedLangs = await Languages_DB.query(
            Q.where("lang_id", Q.oneOf(memoizedLangIds))
          ).fetch();
        } else if (memoizedSearch) {
          // Fetch languages based on search criteria
          const sanitizedSearch = Q.sanitizeLikeString(memoizedSearch);
          fetchedLangs = await Languages_DB.query(
            Q.or(
              Q.where("lang_id", Q.like(`%${sanitizedSearch}%`)),
              Q.where("lang_in_en", Q.like(`%${sanitizedSearch}%`)),
              Q.where("lang_in_de", Q.like(`%${sanitizedSearch}%`)),
              Q.where("country_in_en", Q.like(`%${sanitizedSearch}%`)),
              Q.where("country_in_de", Q.like(`%${sanitizedSearch}%`))
            )
          ).fetch();
        } else {
          // Fetch all languages
          fetchedLangs = await Languages_DB.query().fetch();
        }

        SET_langs(fetchedLangs);
      } catch (error) {
        console.error("🔴 Error fetching languages: ", error);
        SET_fetchLangsError("🔴 Error fetching languages.");
      } finally {
        SET_langsFetching(false);
      }
    };

    fetchLangs();
  }, [memoizedLangIds, memoizedSearch]);

  return { langs, ARE_langsFetching, fetchLangs_ERROR };
}
