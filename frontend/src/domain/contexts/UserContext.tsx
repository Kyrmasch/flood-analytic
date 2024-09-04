import React, { createContext, useContext, ReactNode } from "react";
import { IUser } from "../interfaces/auth";
import { useMeQuery } from "../store/api/auth";

interface UserContextType {
  user: IUser | null | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: meData, isLoading } = useMeQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <></>;

  return (
    <UserContext.Provider value={{ user: meData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): IUser | null | undefined => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};
