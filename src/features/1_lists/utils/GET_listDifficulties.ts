//
//
//

import { List_PROPS } from "@/src/db/props";

export default function GET_listDifficulties(
  list: List_PROPS | undefined = undefined
) {
  return list?.vocabs?.reduce(
    (acc, vocab) => {
      if (vocab.difficulty === 1) acc.difficulty_1 += 1;
      if (vocab.difficulty === 2) acc.difficulty_2 += 1;
      if (vocab.difficulty === 3) acc.difficulty_3 += 1;
      acc.total += 1;
      return acc;
    },
    {
      total: 0,
      difficulty_1: 0,
      difficulty_2: 0,
      difficulty_3: 0,
    }
  );
}
