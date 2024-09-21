//
//
//

import React, { createContext, useState, useContext } from "react";
import { List_MODEL } from "../db/models";

interface ListContextType {
  selected_LIST: List_MODEL;
  SET_selectedList: (list: List_MODEL) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const SelectedList_PROVIDER: React.FC = ({ children }) => {
  const [selected_LIST, SET_selectedList] = useState<List_MODEL | undefined>(
    undefined
  );

  return (
    <ListContext.Provider value={{ selected_LIST, SET_selectedList }}>
      {children}
    </ListContext.Provider>
  );
};

export const USE_selectedList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
