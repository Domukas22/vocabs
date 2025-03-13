//
//
//

export function HANDLE_markedFilter() {
  return (state: any) => ({
    filters: {
      ...state.filters,
      byMarked: !state.filters.byMarked,
    },
  });
}
