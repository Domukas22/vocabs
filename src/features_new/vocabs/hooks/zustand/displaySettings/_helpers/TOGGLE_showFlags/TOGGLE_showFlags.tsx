//
//
//

export function TOGGLE_showFlags() {
  return (state: any) => ({
    appearance: {
      ...state.appearance,
      SHOW_flags: !state.appearance.SHOW_flags,
    },
  });
}
