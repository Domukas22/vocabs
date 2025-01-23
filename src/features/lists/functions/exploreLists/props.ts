//
//
//

export type FetchedSharedList_PROPS = {
  id: string;
  name: string;
  description: string;
  collected_lang_ids: string;
  owner: {
    username: string;
  }[];
  vocabs: {
    count: number;
  }[];
};
