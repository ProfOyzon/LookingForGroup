import "./styles.css"

export const ProjectPost = (props) => {
  return (
    <>
    <img src='' alt=''/>
    <h2 className='post-title'>{props.title}</h2>
    <div className='post-date'>{props.date}</div>
    <button className='share-post'><img src='' alt=''/></button>
    </>
  )
}