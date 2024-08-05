
/*component used for things like project tags or user skills */
export const Tags = ({children}) => {
    return (  
        <div className="tag">
            <p className="tag-name">{children}</p>
        </div>
    );
}