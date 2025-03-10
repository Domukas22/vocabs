//
//
//

export function FORMAT_rawColelctedLangIds(
  rawLang_IDs:
    | {
        collected_lang_ids: string[];
      }[]
    | null
): {
  lang_IDs: string[];
} {
  if (!rawLang_IDs) return { lang_IDs: [] };

  const lang_IDs = Array.from(
    new Set(rawLang_IDs.flatMap((item) => item.collected_lang_ids))
  );

  return { lang_IDs };
}
