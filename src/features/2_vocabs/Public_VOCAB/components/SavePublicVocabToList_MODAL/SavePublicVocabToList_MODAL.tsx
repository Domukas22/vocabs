//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Modal, SafeAreaView } from "react-native";
import { List_MODEL, PublicVocab_MODEL } from "@/src/db/models";

import { useTranslation } from "react-i18next";

interface SelectListModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  user_id: string;
  SET_targetSaveList: React.Dispatch<
    React.SetStateAction<List_MODEL | undefined>
  >;
  targetSave_VOCAB: PublicVocab_MODEL | undefined;
}

export default function SavePublicVocabToList_MODAL({
  open,
  TOGGLE_open,
  user_id,
  targetSave_VOCAB,
}: SelectListModal_PROPS) {
  const { t } = useTranslation();

  // const [search, SET_search] = useState("");
  // const [selectedModal_LIST, SET_selectedModalList] = useState<
  //   List_MODEL | undefined
  // >(undefined);
  // const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);

  // const [loading, SET_loading] = useState(false);

  // const [lists, SET_lists] = useState<List_MODEL[]>([]);
  // const GET_lists = async () => {
  //   SET_loading(true);
  //   const res = await FETCH_privateLists({ user_id, search: "" });
  //   SET_lists([...(res?.data || [])]);
  //   SET_loading(false);
  // };

  // const { COPY_privateVocab, IS_copyingVocab } = USE_copyPublicVocab({
  //   vocab: targetSave_VOCAB,
  //   list_id: selectedModal_LIST?.id,
  //   user_id,
  //   toggleFn: TOGGLE_open,
  // });

  // const submit = () => {
  //   if (!IS_copyingVocab) COPY_privateVocab();
  // };

  // useEffect(() => {
  //   GET_lists();

  //   const subscription = SUBSCRIBE_toLists({ SET_lists });
  //   return () => {
  //     supabase.removeChannel(subscription);
  //   };
  // }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={open} style={{}}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,

          flex: 1,
        }}
      >
        <Header
          title={t("modal.selectList.header")}
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={TOGGLE_open}
              style={{ borderRadius: 100 }}
            />
          }
        />
        {/* <Subnav>
          <SearchBar value={search} SET_value={SET_search} />
        </Subnav>

        {!loading && lists ? (
          <FlatList
            data={
              search === ""
                ? lists
                : lists.filter((list) =>
                    list.name.toLowerCase().includes(search.toLowerCase())
                  )
            }
            ListFooterComponent={
              <Btn
                iconLeft={<ICON_X color="primary" />}
                text={t("btn.createList")}
                onPress={() => {}}
                type="seethrough_primary"
                style={{ flex: 1 }}
              />
            }
            renderItem={({ item }: { item: List_MODEL }) => (
              <Btn
                key={item.id + "list btn" + item.name}
                text={item.name}
                onPress={() => SET_selectedModalList(item)}
                type={item.id === selectedModal_LIST?.id ? "active" : "simple"}
                style={{ flex: 1, marginBottom: 8 }}
                text_STYLES={{ flex: 1 }}
              />
            )}
            keyExtractor={(item) => item.id + "list btn" + item.name}
            style={{ padding: 12, flex: 1 }}
          />
        ) : (
          <Styled_TEXT>Loading</Styled_TEXT>
        )}

        <Footer
          btnLeft={
            <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
          }
          btnRight={
            <Btn
              text={!IS_copyingVocab ? t("btn.confirmAddinVocabToList") : ""}
              iconLeft={
                IS_copyingVocab ? <ActivityIndicator color="black" /> : null
              }
              onPress={submit}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
            />
          }
        />  */}
      </SafeAreaView>
      {/* <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
        /> */}
    </Modal>
  );
}
