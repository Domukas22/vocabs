//
//
//

export function HIGHLIGHT_vocab(
  vocab_ID: string,
  set: (state: any) => void,
  get: () => { highlightTimeout_ID: any }
) {
  const currentTimeoutID = get().highlightTimeout_ID;

  // If there is a previous timeout, clear it
  if (currentTimeoutID) {
    clearTimeout(currentTimeoutID);
  }

  // Set the new highlighted vocab ID
  set({ highlighted_ID: vocab_ID });

  // Set a new timeout to reset the highlighted vocab ID after 5 seconds
  const timeoutID = setTimeout(() => {
    set({ highlighted_ID: "" });
  }, 5000);

  // Save the timeout reference in the state to clear it if needed
  set({ highlightTimeout_ID: timeoutID });
}
