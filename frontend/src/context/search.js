import { createContext, useContext, useState } from "react";

export const SearchContext = createContext({});

export const SearchContextProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch };
