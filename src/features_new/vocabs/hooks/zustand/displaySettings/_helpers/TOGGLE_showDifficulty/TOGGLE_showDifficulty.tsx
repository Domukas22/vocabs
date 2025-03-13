//
//
//

export function TOGGLE_showDifficulty() {
  return (state: any) => ({
    appearance: {
      ...state.appearance,
      SHOW_difficulty: !state.appearance.SHOW_difficulty,
    },
  });
}
