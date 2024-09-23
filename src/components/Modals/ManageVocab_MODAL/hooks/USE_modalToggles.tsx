//
//
//

import { USE_toggle } from "@/src/hooks/USE_toggle";

export default function USE_modalToggles() {
  const [SHOW_selectListModal, TOGGLE_selectListModal] = USE_toggle(false);
  const [SHOW_selectLangModal, TOGGLE_selectLangModal] = USE_toggle(false);
  const [SHOW_trTextModal, TOGGLE_trTextModal] = USE_toggle(false);
  const [SHOW_trHighlightsModal, TOGGLE_trHighlightsModal] = USE_toggle(false);

  return {
    SHOW_selectListModal,
    SHOW_selectLangModal,
    SHOW_trTextModal,
    SHOW_trHighlightsModal,
    TOGGLE_selectListModal,
    TOGGLE_selectLangModal,
    TOGGLE_trTextModal,
    TOGGLE_trHighlightsModal,
  };
}
