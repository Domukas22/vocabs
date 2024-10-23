//
//
//

export default function GET_handledDifficulties({
  difficultyFilters,
  incoming_DIFF,
}: {
  difficultyFilters: (1 | 2 | 3)[];
  incoming_DIFF: 1 | 2 | 3;
}) {
  if (difficultyFilters && incoming_DIFF) {
    return difficultyFilters.some((d) => d === incoming_DIFF)
      ? difficultyFilters.filter((d) => d !== incoming_DIFF)
      : [...difficultyFilters, incoming_DIFF];
  }

  return difficultyFilters;
}
