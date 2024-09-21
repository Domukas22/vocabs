//
//
//

import { Text, View } from "react-native";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import Header from "@/src/components/Header/Header";
import {
  ICON_3dots,
  ICON_arrow,
  ICON_displaySettings,
  ICON_X,
} from "@/src/components/icons/icons";
import { Vocab_MODEL } from "@/src/db/lists/models";
import { useEffect, useState } from "react";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";
import FETCH_userVocabs from "@/src/db/vocabs/FETCH_userVocabs";
import { supabase } from "@/src/lib/supabase";
import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";
import Styled_FLATLIST from "@/src/components/Flatlists/Styled_FLATLIST/Styled_FLATLIST";
import Vocab from "@/src/components/Vocab/Vocab";
import { DisplaySettings_MODEL } from "@/src/db/models";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import MyVocabs_SUBNAV from "@/src/components/Subnav/MyVocabs_SUBNAV";
import DisplaySettings_MODAL from "@/src/components/Modals/DisplaySettings_MODAL/DisplaySettings_MODAL";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [loading, SET_loading] = useState(false);
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const GET_vocabs = async () => {
    SET_loading(true);
    const res = await FETCH_userVocabs({ list_id: selected_LIST.id });

    SET_vocabs([...(res?.data || [])]);
    SET_loading(false);
  };

  useEffect(() => {
    GET_vocabs();

    const subscription = SUBSCRIBE_toVocabs({ SET_vocabs });
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const [toEdit_VOCAB, SET_toEditVocab] = useState<Vocab_MODEL | null>(null);
  const [toEdit_TRANSLATIONS, SET_toEditTranslations] = useState<
    TranslationCreation_PROPS[] | null
  >(null);

  function HANDLE_vocabModal({
    clear = false,
    vocab,
    translations,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    translations?: TranslationCreation_PROPS[];
  }) {
    if (!clear && vocab && translations) {
      const trs = translations?.map((tr) => ({
        lang_id: tr.lang_id,
        text: tr.text || "",
        highlights: tr.highlights || "",
      }));

      SET_toEditVocab(vocab);
      SET_toEditTranslations(trs);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_toEditVocab(null);
      SET_toEditTranslations(null);
      TOGGLE_vocabModal();
    }
  }

  const [displaySettings, SET_displaySettings] =
    useState<DisplaySettings_MODEL>({
      search: "",
      sorting: "date",
      sortDirection: "ascending",
      SHOW_image: true,
      SHOW_listName: true,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontLangId: "en",
      difficultyFilters: [],
    });

  return (
    <Page_WRAP>
      <Header
        title={selected_LIST.name || "none"}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ borderRadius: 100 }}
          />
        }
      />

      <MyVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        TOGGLE_displaySettings={TOGGLE_displaySettings}
        HANDLE_vocabModal={HANDLE_vocabModal}
      />
      {loading ? <List_SKELETONS /> : null}
      {!loading ? (
        <Styled_FLATLIST
          data={vocabs}
          renderItem={({ item }) => (
            <View>
              <Vocab
                vocab={item}
                translations={[]}
                displaySettings={displaySettings}
                selected_LIST={selected_LIST}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}

      <DisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />
    </Page_WRAP>
  );
}
