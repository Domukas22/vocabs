//
//
//

import { useState } from "react";

export function USE_loading() {
  const [loading, SET_loading] = useState(false);

  return { loading, SET_loading };
}
