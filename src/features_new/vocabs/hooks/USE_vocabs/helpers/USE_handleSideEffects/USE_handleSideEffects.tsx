//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { SetStateAction, useEffect } from "react";
import { USE_createVocabInTheUi } from "../ui/USE_createVocabInTheUi/USE_createVocabInTheUi";
import {
  USE_deleteOneVocabFromUi,
  USE_prependOneVocabIntoUi,
  USE_updateOneVocabInUi,
} from "./helpers";
import { vocabUpdate_TYPES, Vocab_EVENTS } from "@/src/mitt/mitt";

export function USE_handleSideEffects({
  vocabs = [],
  SET_vocabs = () => {},
  SET_unpaginatedCount = () => {},
  highlight = () => {},
}: {
  vocabs: Vocab_TYPE[];
  SET_vocabs: (value: SetStateAction<Vocab_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
  highlight: (id: string | undefined) => void;
}) {
  const { PREPEND_oneVocabIntoUi } = USE_prependOneVocabIntoUi({
    highlight,
    SET_unpaginatedCount,
    SET_vocabs,
  });

  const { DELETE_oneVocabFromUi } = USE_deleteOneVocabFromUi({
    SET_unpaginatedCount,
    SET_vocabs,
  });

  const { UPDATE_oneVocabInUi } = USE_updateOneVocabInUi({
    vocabs,
    highlight,
    SET_vocabs,
  });

  useEffect(() => {
    const handler = ({
      vocab,
      type,
    }: {
      vocab: Vocab_TYPE;
      type: vocabUpdate_TYPES;
    }) => UPDATE_oneVocabInUi(vocab, type);

    Vocab_EVENTS.on("updated", handler);
    return () => Vocab_EVENTS.off("updated", handler);
  }, []);

  useEffect(() => {
    const handler = (vocab: Vocab_TYPE) => PREPEND_oneVocabIntoUi(vocab);
    Vocab_EVENTS.on("created", handler);
    return () => Vocab_EVENTS.off("created", handler);
  }, []);

  useEffect(() => {
    const handler = ({
      vocab_ID,
      list_ID,
    }: {
      vocab_ID: string;
      list_ID: string;
    }) => DELETE_oneVocabFromUi(vocab_ID, list_ID);
    Vocab_EVENTS.on("deleted", handler);
    return () => Vocab_EVENTS.off("deleted", handler);
  }, []);
}
