//
//
//

import { useState } from "react";

export function USE_pagination({
  paginateBy = 10,
  fetch = async () => {},
}: {
  paginateBy: number;
  fetch: (start: number, end: number) => Promise<void>;
}) {
  const [start, SET_start] = useState(0);
  const [end, SET_end] = useState(paginateBy);

  const paginate = async () => {
    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;
    SET_start(newStart);
    SET_end(newEnd);
    await fetch(newStart, newEnd);
  };

  const RESET_pagination = async () => {
    SET_start(0);
    SET_end(paginateBy);
    await fetch(0, paginateBy);
  };

  return { RESET_pagination, paginate };
}
