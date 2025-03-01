//
//
//

export function REDUCE_collectedLangIds(
  lang_ids: { lang_ids: string[] }[] | null
): string {
  return Array.from(new Set(lang_ids?.flatMap((item) => item.lang_ids))).join(
    ","
  );
}
