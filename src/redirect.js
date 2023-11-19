import { createContext, useContext, useState } from 'react';

const RedirectPathContext = createContext();

export function useRedirectPath() {
  return useContext(RedirectPathContext);
}

export function RedirectPathProvider({ children }) {
  const [redirectPath, setRedirectPath] = useState(null);

  const setPath = (path) => {
    setRedirectPath(path);
  };

  return <RedirectPathContext.Provider value={{ redirectPath, setPath }}>{children}</RedirectPathContext.Provider>;
}
