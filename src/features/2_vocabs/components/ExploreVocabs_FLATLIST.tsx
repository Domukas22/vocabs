import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import ExploreVocabBack_BTNS from "./Vocab/Components/ExploreVocabBack_BTNS/ExploreVocabBack_BTNS";
import Vocab from "./Vocab/Vocab";
import ExploreVocabsFlatlistBottom_SECTION from "./ExploreVocabsFlatlistBottom_SECTION";
import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";
import React from "react";
import {
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";

export default function ExploreVocabs_FLATLIST({
  vocabs,
  search = "",
  IS_loadingMore,
  HAS_reachedEnd,
  ARE_vocabsFetching,
  LOAD_more,
  SAVE_vocab,
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  search: string;
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  ARE_vocabsFetching: boolean;
  LOAD_more: () => void;
  SAVE_vocab: (vocab: Vocab_MODEL) => void;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS;
}) {
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => {
        return (
          <Vocab
            vocab={item}
            vocabBack_BTNS={(TOGGLE_vocab: () => void) => (
              <ExploreVocabBack_BTNS
                {...{ TOGGLE_vocab }}
                SAVE_vocab={() => SAVE_vocab(item)}
                list={item?.list}
              />
            )}
            SHOW_list
          />
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
      ListHeaderComponent={
        <View style={{ paddingBottom: 16 }}>
          <Styled_TEXT type="label">
            {search !== "" ? (
              <>
                Search results for
                <Styled_TEXT type="text_18_medium"> '{search}' </Styled_TEXT>
              </>
            ) : (
              "Browse through 57 public lists"
            )}
          </Styled_TEXT>
          {z_vocabDisplay_SETTINGS &&
            (z_vocabDisplay_SETTINGS.difficultyFilters?.length > 0 ||
              z_vocabDisplay_SETTINGS.langFilters?.length > 0) && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  flexWrap: "wrap",
                  paddingTop: 12,
                }}
              >
                {z_vocabDisplay_SETTINGS.difficultyFilters?.length > 0 &&
                  z_vocabDisplay_SETTINGS.difficultyFilters.map((diff) => (
                    <Btn
                      iconLeft={<ICON_difficultyDot difficulty={diff} />}
                      text={"Difficulty: " + diff}
                      iconRight={<ICON_X color="primary" rotate={true} />}
                      type={
                        diff === 1
                          ? "difficulty_1_active"
                          : diff === 2
                          ? "difficulty_2_active"
                          : "difficulty_3_active"
                      }
                      tiny={true}
                      onPress={() => {
                        z_SET_vocabDisplaySettings({
                          difficultyFilters:
                            z_vocabDisplay_SETTINGS.difficultyFilters.filter(
                              (d) => d !== diff
                            ),
                        });
                      }}
                      key={diff + "diffFilter"}
                    />
                  ))}
                {z_vocabDisplay_SETTINGS.langFilters?.length > 0 &&
                  z_vocabDisplay_SETTINGS.langFilters.map((lang_id) => (
                    <Btn
                      iconLeft={<ICON_flag lang={lang_id} />}
                      text={lang_id.toUpperCase()}
                      iconRight={<ICON_X color="primary" rotate={true} />}
                      type="active"
                      tiny={true}
                      onPress={() => {
                        z_SET_vocabDisplaySettings({
                          langFilters:
                            z_vocabDisplay_SETTINGS.langFilters.filter(
                              (l) => l !== lang_id
                            ),
                        });
                      }}
                      key={lang_id + "langFilter"}
                    />
                  ))}
              </View>
            )}
        </View>
      }
      ListFooterComponent={
        <ExploreVocabsFlatlistBottom_SECTION
          {...{
            IS_loadingMore,
            HAS_reachedEnd,
            ARE_vocabsFetching,
            LOAD_more,
          }}
        />
      }
    />
  );
}
