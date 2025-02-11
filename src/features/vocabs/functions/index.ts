//
//
//

// -- myVocabs

// __other
export { GET_defaultTranslations } from "./1_myVocabs/__other/GET_defaultTranslations/GET_defaultTranslations";
export { HANLDE_selectedLangs } from "./1_myVocabs/__other/HANLDE_selectedLangs/HANLDE_selectedLangs";
export { HANLDE_selectedHighlights } from "./1_myVocabs/__other/HANLDE_selectedHighlights/HANLDE_selectedHighlights";
export { HANDLE_langRemoval } from "./1_myVocabs/__other/HANDLE_langRemoval/HANLDE_langRemoval";

// create hooks
export { USE_createVocab } from "./1_myVocabs/create/hooks/USE_createVocab/USE_createVocab";

// delete hooks
export { USE_deleteVocab } from "./1_myVocabs/delete/hooks/USE_deleteVocab/USE_deleteVocab";

// update hooks
export { USE_updateVocab } from "./1_myVocabs/update/hooks/USE_updateVocab/USE_updateVocab";
export { USE_updateVocabDifficulty } from "./1_myVocabs/update/hooks/USE_updateVocabDifficulty/USE_updateVocabDifficulty";
export { USE_updateVocabIsMarked } from "./1_myVocabs/update/hooks/USE_updateVocabIsMarked/USE_updateVocabIsMarked";

//hooks
export { USE_myVocabValues } from "./1_myVocabs/hooks/USE_myVocabValues/USE_myVocabValues";

// =================================================================================================

// -- exploreVocabs

// fetch hooks
export { USE_fetchTotalPublicVocabCount } from "./2_exploreVocabs/fetch/hooks/USE_fetchTotalPublicVocabCount/USE_fetchTotalPublicVocabCount";
export { USE_fetchVocabsOfASharedList } from "./2_exploreVocabs/fetch/hooks/USE_fetchVocabsOfASharedList/USE_fetchVocabsOfASharedList";
export { USE_filteredPublicVocabs } from "./2_exploreVocabs/fetch/hooks/USE_filteredPublicVocabs/USE_filteredPublicVocabs";
export { USE_supabaseVocabs } from "./2_exploreVocabs/fetch/hooks/USE_supabaseVocabs/USE_supabaseVocabs";
export { USE_supabaseVocabsOfAList } from "./2_exploreVocabs/fetch/hooks/USE_supabaseVocabsOfAList/USE_supabaseVocabsOfAList";
