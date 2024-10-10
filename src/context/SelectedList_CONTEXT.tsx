//
//
//

import React, { createContext, useState, useContext } from "react";
import { List_PROPS } from "../db/props";

interface ListContextType {
  selected_LIST: List_PROPS;
  SET_selectedList: (list: List_PROPS) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const SelectedList_PROVIDER: React.FC = ({ children }) => {
  const [selected_LIST, SET_selectedList] = useState<List_PROPS | undefined>(
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
