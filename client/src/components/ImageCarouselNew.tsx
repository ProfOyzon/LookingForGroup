import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ThemeIcon } from './ThemeIcon';

// This post was used to help create this component (found by Ben Gomez)
// https://blog.bitsrc.io/simple-carousel-in-react-2aac73887243

const CarouselContext = createContext({
    currentIndex: 0,
    handleIndexChange: (newIndex: number) => {},
    handleHover: (hovering: boolean) => {},
    dataList: [],
});

// Creates a button to navigate forward or backward in carousel order
export const CarouselButton = ({ direction, className = '' }) => {
    const { currentIndex, handleIndexChange } = useContext(CarouselContext);
    const directionNum = (direction === 'left') ? -1 : 1;

    return (
        <button
            className={`${className} carousel-btn-${direction}`}
            onClick={() => handleIndexChange(currentIndex + directionNum)}
        >
            <ThemeIcon 
                light={'assets/arrow_light.png'}
                dark={'assets/arrow_dark.png'}
                alt={(direction === 'left') ? 'left' : 'right'}
            />
        </button>
    );
};

// Creates a series of buttons to display current carousel item and navigate to specific items
export const CarouselTabs = ({ className = '' }) => {
    const { currentIndex, handleIndexChange, dataList } = useContext(CarouselContext);

    return (
        <div className={`carousel-tabs ${className}`}>
            {dataList.map((data, index) => {
                const active = (index === currentIndex) ? ' carousel-tab-active' : '';
                
                // Create tabs for every single
                return (
                    <button
                        className={`carousel-tab ${active}`}
                        onClick={() => handleIndexChange(index)}
                        key={index}
                    ></button>
                );
            })}
        </div>
    );
};

// Only displays the current index of dataList (dataList MUST be an array of elements to work)
export const CarouselContent = ({ className = '' }) => {
    const { currentIndex, handleHover, dataList } = useContext(CarouselContext);

    return (
        <div className='carousel-contents'>
            {dataList.map((data) => {
                return (
                    <div
                        className={className}
                        onMouseEnter={() => handleHover(true)}
                        onMouseLeave={() => handleHover(false)}
                        style={{ transform: `translate(-${currentIndex * 100}%)` }}
                    >{data}</div>
                );
            })}
        </div>
    )
};

// Primary component all Carousel components should be wrapped in
export const Carousel = ({ dataList = [], children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovering, setHovering] = useState(false);

    const skipAuto = useRef(false);

    const handleIndexChange = (newIndex: number) => {
        skipAuto.current = true;
        if (newIndex > dataList.length - 1) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = dataList.length - 1;
        }

        setCurrentIndex(newIndex);
    };

    const handleHover = (hovering) => {
        if (hovering) {
            skipAuto.current = true;
            setHovering(true);
        } else {
            setHovering(false);
        }
    };

    const autoScroll = () => {
        if (skipAuto.current) {
            if (hovering) {
                return;
            } else {
                skipAuto.current = false;
                return;
            }
        }

        if (currentIndex === dataList.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Will attempt autoscroll every 10,000 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            autoScroll();
        }, 10_000);

        return () => clearInterval(interval);
    });

    return <CarouselContext.Provider value={{ currentIndex, handleIndexChange, handleHover, dataList }}>{children}</CarouselContext.Provider>
};