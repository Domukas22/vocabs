//
//
//

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { internalErrMsg_TYPES } from "../../../types";

export function VALIDATE_watermelonFetch({
  unpaginated_COUNT,
  vocabs,
  THROW_err = () => {},
}: {
  unpaginated_COUNT: number;
  vocabs: Vocab_MODEL[];
  THROW_err: (type: internalErrMsg_TYPES) => void;
}) {
  if (typeof unpaginated_COUNT !== "number") {
    throw THROW_err("undefined_watermelon_totalCount");
  }

  if (!vocabs || !Array.isArray(vocabs)) {
    throw THROW_err("undefined_watermelon_vocabs");
  }
}
