import "../styles/post.css";

const PostComponent = ({ image, title, location, date }) => {
    return (
        <div className="post-card">
            {image && <img src={image} alt={title} className="card-image" />}
            <div className="card-body">
                {title && <h3 className="card-title">{title}</h3>}

                <div className="card-subinfo">
                    {location && <span className="card-location">{location}</span>}
                    {date && <span className="card-date">{date}</span>}
                </div>

            </div>
        </div>
    );
}

export default PostComponent