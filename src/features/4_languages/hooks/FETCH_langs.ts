import { useEffect, useState } from "react";
import { Languages_DB } from "@/src/db"; // Adjust the import based on your project structure
import { Q } from "@nozbe/watermelondb";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";

export default async function FETCH_langs({
  lang_ids,
  search,
}: {
  lang_ids?: string[];
  search?: string;
}): Promise<Language_MODEL[]> {
  let fetchedLangs: Language_MODEL[];

  if (lang_ids && Array.isArray(lang_ids)) {
    // Fetch languages by lang_ids
    fetchedLangs = await Languages_DB.query(
      Q.where("lang_id", Q.oneOf(lang_ids))
    ).fetch();
  } else if (search) {
    // Fetch languages based on search criteria
    const sanitizedSearch = Q.sanitizeLikeString(search.trim());
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

  return fetchedLangs; // Directly return the fetched languages
}
