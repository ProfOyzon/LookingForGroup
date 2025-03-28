import { CarouselButton, CarouselTabs, CarouselContent, Carousel } from "./ImageCarouselNew";
import placeholderThumbnail from '../images/project_temp.png';

export const ProjectCarousel = ({ project }) => {
    // If no images exist, just use thumbnail
    let carouselContents;

    if (!project.images) {
        carouselContents = [];
        carouselContents.push(<img src={`/assets/project_temp-DoyePTay.png`} />);
    } else {
        carouselContents = project.images.map((imageData) => {
            console.log(imageData);
    
            return (
                <img src={`images/projects/${imageData.image}`}></img>
            );
        });
    }

    return (
        <Carousel dataList={carouselContents}>
            <div className='project-carousel'>
                <div className='carousel-row'>
                    <CarouselContent className='project-carousel-content' />
                </div>
                <div className='carousel-row'>
                    <CarouselButton 
                        direction='left'
                        className='project-carousel-btn' 
                    />
                    <CarouselTabs className='project-carousel-tabs'></CarouselTabs>
                    <CarouselButton 
                        direction='right'
                        className='project-carousel-btn' 
                    />
                </div>
            </div>
        </Carousel>
    );
};