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
        const pageElement = document.querySelector(".page");
        if (pageElement) {
            pageElement.addEventListener("scroll", () => toggleVisible(pageElement));
        }
    });

    return (
        <div className="ToTopContainer">
            <button className={"to-top-button"} onClick={() => scrollToTop(document.querySelector(".page"))} style={{display: visible ? "inline" : "none"}}>
                <img 
                src="assets/dropdown_dark.png" 
                src-light="assets/dropdown_light.png"
                src-dark="assets/dropdown_dark.png"
                alt="" />
            </button>
        </div>
    );
};

export default ToTopButton;