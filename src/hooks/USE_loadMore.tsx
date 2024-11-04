//
//
//

import { useState } from "react";

export default function USE_loadMore({
  allowed = false,
  action = async () => {},
}: {
  allowed: boolean;
  action: () => Promise<void>;
}) {
  const [IS_loadingMore, SET_loadingMore] = useState(false);

  async function LOAD_more() {
    if (!allowed) return;
    SET_loadingMore(true);
    await action();
    SET_loadingMore(false);
  }

  return { LOAD_more, IS_loadingMore };
}
