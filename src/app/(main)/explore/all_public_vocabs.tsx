//
//
//

import React from "react";

import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import PublicVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { AllPublicVocabs_NAV } from "@/src/features_new/vocabs/components/navs/AllPublicVocabs_NAV/AllPublicVocabs_NAV";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { SaveVocab_MODAL } from "@/src/features_new/vocabs/components/modals/SaveVocab_MODAL/SaveVocab_MODAL";

const fetch_TYPE: vocabFetch_TYPES = "all";

export default function AllPublicVocabs_PAGE() {
  const { modals } = USE_modalToggles(["saveVocab", "displaySettings"]);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const { filters, sorting, z_GET_activeFilterCount } =
    z_USE_publicVocabsDisplaySettings();

  const { z_user } = z_USE_user();

  const {
    error,
    vocabs,
    lang_IDS,
    loading_STATE,
    highlighted_ID,
    HAS_reachedEnd,
    unpaginated_COUNT,
    refetch,
    LOAD_more,
  } = USE_vocabs({
    fetch_TYPE,
    IS_private: false,
    search,
    targetList_ID: "",
    filters,
    sorting,
    user: z_user,
  });

  return (
    <>
      <AllPublicVocabs_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SHOW_listName={showTitle}
      />

      <PublicVocabs_FLASHLIST
        OPEN_copyVocabModal={() => modals.saveVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        vocabs={vocabs}
        fetch_TYPE={fetch_TYPE}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={t("listName.allPublicVocabs")}
            unpaginated_COUNT={unpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="public-vocabs"
          />
        }
        Footer={
          <VocabFlatlist_FOOTER
            LOAD_more={LOAD_more}
            RESET_search={RESET_search}
            unpaginated_COUNT={unpaginated_COUNT}
            HAS_reachedEnd={HAS_reachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={loading_STATE}
            debouncedSearch={debouncedSearch}
            error={error}
          />
        }
      />

      <Portal>
        <DisplaySettings_MODAL
          lang_IDS={lang_IDS}
          starting_TAB="vocab-preview"
          type="public-vocabs"
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
        <SaveVocab_MODAL
          IS_open={modals.saveVocab.IS_open}
          CLOSE_modal={() => modals.saveVocab.set(false)}
        />

        {/* <SavePublicVocabToList_MODAL
          vocab={toCopy_VOCAB}
          IS_open={modals.saveVocab.IS_open}
          onSuccess={() => {
            modals.saveVocab.set(false);
            RESET_targetVocabs();

            toast.show(t("notifications.savedVocab"), {
              type: "success",
              duration: 3000,
            });
          }}
          TOGGLE_open={() => {
            modals.saveVocab.set(false);
            RESET_targetVocabs();
          }}
        /> */}
      </Portal>
    </>
  );
}
