import { createContext, useState } from "react";

const AuthContext = createContext({});

export type AuthType = {
  user?: string;
  accessToken?: string;
  roles?: string[];
  email?: string;
  maskedEmail?: string;
  name?: string;
  mobile?: string;
  profileImage?: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthType>({} as AuthType);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;