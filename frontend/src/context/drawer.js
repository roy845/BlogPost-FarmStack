import { createContext, useContext, useState } from "react";

export const DrawerContext = createContext({});

export const DrawerContextProvider = ({ children }) => {
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  return (
    <DrawerContext.Provider
      value={{
        state,
        toggleDrawer,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

const useDrawer = () => useContext(DrawerContext);

export { useDrawer };
