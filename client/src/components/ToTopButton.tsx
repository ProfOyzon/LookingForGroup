import {useState, useEffect} from 'react';

const ToTopButton = () => {
    let [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        console.log("test");
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 50) {
            setVisible(true);
        }
        else if (scrolled <= 50) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        console.log("test2");
        // window.scrollTo({
        //     top: 0,
        //     left: 0,
        //     behavior: "smooth"
        // });
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => toggleVisible());
    });

    return (
        <div className="ToTopContainer">
            <button className={"to-top-button"} onClick={() => scrollToTop()} style={{display: visible ? "inline" : "none"}}>{"^"}</button>
        </div>
    );
    // return (
    //     <div className="ToTopContainer">
    //         <button className={"to-top-button"} onClick={scrollToTop} style={{visibility: visible ? "visible" : "hidden"}}>{"^"}</button>
    //     </div>
    // );
};

export default ToTopButton;