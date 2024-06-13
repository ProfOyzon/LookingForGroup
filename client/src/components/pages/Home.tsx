import "./pages.css";
import { DiscoverCards } from "../DiscoverCards";
import { DiscoverButton } from "../DiscoverButton";
import { SearchBar } from "../SearchBar";
import "../styles.css";

const Home = (props) => {

    const handleButtonClick = () => {
        
    }

    return (
        <div>
            <h1 className="page-title">Discover</h1>
            <div id="discover-button-wrapper">                
                <DiscoverButton isActive={true}>Projects</DiscoverButton>
                <DiscoverButton isActive={false}>People</DiscoverButton>
                <SearchBar currentSelection="All"></SearchBar>
            </div>
            <DiscoverCards></DiscoverCards>
        </div>
    );
}

export default Home;