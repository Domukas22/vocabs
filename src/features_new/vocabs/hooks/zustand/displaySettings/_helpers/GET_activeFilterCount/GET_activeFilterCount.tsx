//
//
//

export function GET_activeFilterCount(state: any): number {
  return (
    state.filters?.langs?.length +
    state.filters?.difficulties?.length +
    (state.filters?.byMarked ? 1 : 0)
  );
}
