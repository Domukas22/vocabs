import { useCallback, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

/**
 * Custom hook to toggle a boolean value.
 *
 * @param defaultValue - Optional initial value for the boolean. Defaults to `false` if not provided.
 * @returns
 *   - `value`: The current boolean value.
 *   - `toggle`: A function that toggles the `value` between `true` and `false`.
 *   - `setValue`: A function to directly set the `value` state.
 */
export function USE_toggle(
  defaultValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  // Initialize the state with the default value
  const [value, setValue] = useState(!!defaultValue);

  // Toggle the current value between true and false
  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  // Return the current value, toggle function, and setValue function
  return [value, toggle, setValue];
}
