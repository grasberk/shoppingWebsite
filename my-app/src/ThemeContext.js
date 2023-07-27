import React, {createContext, useState, useContext} from "react";


const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);


export function ThemeProvider({children}){
    const [isDarkMode, setIsDarkMode] = useState(false);


    const toggleTheme=()=>{
        setIsDarkMode((prevIsDarkMode)=>!prevIsDarkMode);
    };

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}