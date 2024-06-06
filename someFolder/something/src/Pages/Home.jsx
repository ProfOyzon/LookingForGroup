import React from 'react';
import '../Css/style.css';
import logo from '../img/developer-icon-free-vector.jpg';
import designer from '../img/paintBrush.png';
import project from '../img/Project.png';
import menu from '../img/hamburgerMenu.png';

const Home = () => {
    return (
        <>
            <header></header>
            <div className="flexColumn">
                <div className="flexRow">
                    <h1>
                        Looking For Group
                    </h1>
                    <div className="button-group">
                        <button className="button" type="button" onClick={() => window.location.href = '/Login'}>Login</button>
                        <button className="button" type="button" onClick={() => window.location.href = '/SignUp'}>SignUp</button>
                        <img src={menu} width="32" height="32" alt="Menu Icon" />
                    </div>
                </div>

                <div className="flexLookFor">
                    <h1>
                        Look For
                    </h1>
                </div>

                <div className="flexDescripRow">
                    <h1>Project</h1>
                    <h1>Designers</h1>
                    <h1>Developers</h1>
                </div>

                <div className="flexImgRow">
                    <img src={project} width="100" height="100" alt="Project Icon" />
                    <img src={designer} width="100" height="100" alt="Designer Icon" />
                    <img src={logo} width="100" height="100" alt="Developer Icon" />
                </div>
            </div>

            <footer>
                <div className="footerColumn">
                    <div className="footerRow">
                        <h2>Project</h2>
                        <h2>Designers</h2>
                        <h2>Developers</h2>
                        <h2>Support</h2>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;