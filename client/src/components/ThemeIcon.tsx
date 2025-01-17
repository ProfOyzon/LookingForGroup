import { useContext } from "react"
import { ThemeContext } from "../Contexts"

export const ThemeIcon = ({light, dark, alt="", id="", addClass=""}) => {
    const theme = useContext(ThemeContext)["theme"];
    
    return (
        <img
           src={theme === "dark" ? dark : light}
           src-light={light}
           src-dark={dark}
           alt={alt}
           id={id}
           className={`theme-icon ${addClass}`}
        />
    )
}