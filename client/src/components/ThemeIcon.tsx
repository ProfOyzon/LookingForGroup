import { useContext } from "react"
import { ThemeContext } from "../Contexts"

export const ThemeIcon = ({light, dark}) => {
    const theme = useContext(ThemeContext);
    console.log(theme);
    return (<></>);
}