//
//
//

import { createContext, useState, ReactNode, useContext } from "react";
import { User_MODEL } from "../db/watermelon_MODELS";

const Auth_CONTEXT = createContext<any>(null);

export const Auth_PROVIDER = ({ children }: { children: ReactNode }) => {
  const [user, SET_user] = useState<User_MODEL | null>(null);

  const SET_auth = (authUser: any) => {
    SET_user(authUser);
  };

  const SET_userData = (useData: any) => {
    SET_user({ ...useData });
  };

  return (
    <Auth_CONTEXT.Provider value={{ user, SET_auth, SET_userData }}>
      {children}
    </Auth_CONTEXT.Provider>
  );
};

export const USE_auth = () => useContext(Auth_CONTEXT);
