import '../Styles/pages.css';
import '../Styles/general.css';
import '../Styles/Notfound.css';
import '../../images/sad frog dark mode.png';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '../Header';
import { ThemeIcon } from '../ThemeIcon';



const NotFoundPage = () => {
    const [projectsList, setProjectsList] = useState();
    const [currentSearch, setCurrentSearch] = useState('');
    return(
        <div className = "page">
            <Header dataSets={[{ projectsList }]} onSearch={setCurrentSearch} />
            <div className = "error-box">
                {}<img src='../../images/sad frog dark mode.png' className = "errorFrog"></img>{}
                <h2 className='error-header'>Ooops! Seems like this page is missing or moved.</h2>
                <div className = "error-button-container">
                    {/*
                        This is the Home button, because it will return users home once the Home page is up. It currently returns to Discover page
                    */}
                    <button>
                        <ThemeIcon light={'assets/black/compass.png'} dark={'assets/white/compass.png'} alt={'discover'} /> {/*Home Button Icon*/}
                        {/*}<img className = 'theme-icon'></img>{*/}
                        Home
                        </button>
                    
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;