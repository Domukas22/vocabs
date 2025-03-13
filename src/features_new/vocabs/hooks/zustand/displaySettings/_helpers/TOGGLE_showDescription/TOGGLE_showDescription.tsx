//
//
//

export function TOGGLE_showDescription() {
  return (state: any) => ({
    appearance: {
      ...state.appearance,
      SHOW_description: !state.appearance.SHOW_description,
    },
  });
}
