//
//
//

export function HANDLE_difficultyFilter(diff: 1 | 2 | 3) {
  return (state: any) => {
    const IS_diffAlreadyApplied = state.filters.difficulties.includes(diff);

    if (IS_diffAlreadyApplied) {
      const new_DIFFICULTIES = [...state.filters.difficulties].filter(
        (d) => d !== diff
      );
      return { filters: { ...state.filters, difficulties: new_DIFFICULTIES } };
    }

    return {
      filters: {
        ...state.filters,
        difficulties: [diff, ...state.filters.difficulties],
      },
    };
  };
}
