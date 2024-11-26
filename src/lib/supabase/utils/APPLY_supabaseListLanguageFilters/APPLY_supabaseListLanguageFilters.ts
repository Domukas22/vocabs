//
//
//

export default function APPLY_supabaseListLanguageFilters(
  query: any,
  langFilters?: string[]
) {
  if (!query) return;
  if (!langFilters) return query;

  const langs = langFilters.filter((lang) => lang !== "");

  if (langs.length === 0) return query;

  const filters = langs
    .map((lang) => `collected_lang_ids.ilike.%${lang}%`)
    .join(",");

  return query.or(filters);
}
