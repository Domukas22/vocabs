//
//
//

export function HANDLE_langFilter(targetLang_ID: string) {
  return (state: any) => {
    const IS_langAlreadyApplied = state.filters.langs.includes(targetLang_ID);

    if (IS_langAlreadyApplied) {
      const new_LANGS = [...state.filters.langs].filter(
        (lang) => lang !== targetLang_ID
      );
      return { filters: { ...state.filters, langs: new_LANGS } };
    }

    return {
      filters: {
        ...state.filters,
        langs: [targetLang_ID, ...state.filters.langs],
      },
    };
  };
}
