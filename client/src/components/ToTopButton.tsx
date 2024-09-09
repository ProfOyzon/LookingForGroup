import {useState, useEffect} from 'react';

const ToTopButton = () => {
    let [visible, setVisible] = useState(false);

    const toggleVisible = (scrollPage) => {
        if (scrollPage.scrollTop > 300) {
            setVisible(true);
        }
        else if (scrollPage.scrollTop <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = (scrollPage) => {
        scrollPage.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        document.querySelector(".page").addEventListener("scroll", () => toggleVisible(document.querySelector(".page")));
    });

    return (
        <div className="ToTopContainer">
            <button className={"to-top-button"} onClick={() => scrollToTop(document.querySelector(".page"))} style={{display: visible ? "inline" : "none"}}>{"^"}</button>
        </div>
    );
};

export default ToTopButton;