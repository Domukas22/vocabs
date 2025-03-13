//
//
//

export function SET_frontLangId(newLang_ID: string) {
  return (state: any) => ({
    appearance: {
      ...state.appearance,
      frontTrLang_ID: newLang_ID,
    },
  });
}
