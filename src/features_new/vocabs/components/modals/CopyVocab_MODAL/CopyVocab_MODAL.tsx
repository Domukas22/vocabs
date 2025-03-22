//
//
//

import { SelectMyList_MODAL } from "@/src/features/lists/components";
import { TinyList_TYPE } from "@/src/features_new/lists/types";

export function CopyVocab_MODAL({ IS_open = false }: { IS_open: boolean }) {
  return (
    <SelectMyList_MODAL
      open={IS_open}
      title="Copy vocab"
      submit_ACTION={(list: TinyList_TYPE) => {
        if (list) {
          setValue("list", { id: list?.id, name: list?.name });
          clearErrors("list");
          modals.selectList.set(false);
        }
      }}
      cancel_ACTION={() => {
        modals.selectList.set(false);
      }}
      IS_inAction={IS_creatingVocab}
      initial_LIST={getValues("list")}
    />
  );
}
