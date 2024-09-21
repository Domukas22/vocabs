//
//
//

import Btn from "@/src/components/btn/btn";
import Footer from "../../Footer";

interface ManageVocabFooter_PROPS {
  IS_edit: boolean;
  reset: () => void;
  create: () => void;
  update: () => void;
  btnText: string;
}

export default function ManageVocab_FOOTER({
  IS_edit,
  reset,
  create,
  update,
  btnText,
}: ManageVocabFooter_PROPS) {
  return (
    <Footer
      btnLeft={<Btn text="Cancel" onPress={reset} type="simple" />}
      btnRight={
        <Btn
          text={btnText}
          onPress={() => {
            IS_edit ? update() : create();
            reset();
          }}
          type="action"
          style={{ flex: 1 }}
        />
      }
    />
  );
}
