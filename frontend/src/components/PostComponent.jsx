import "../styles/post.css";

const PostComponent = ({ type, images, title, location, dateTime, description }) => {
    const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
    const displayDate = dateTime
        ? new Date(dateTime).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "";

    const typeColor = type === "found" ? "orange" : type === "lost" ? "red" : "gray";

    return (
        <div className="post-card">
            <div className="type-indicator" style={{ backgroundColor: typeColor }}>
                {type}
            </div>

            {firstImage ? (
                <img src={firstImage} alt={title} className="card-image" />
            ) : ( //daca nu avem poza se afiseaza asta
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',  // vertical
                    height: '12rem',           // aceeași ca imaginea
                    width: '100%',
                    height: '100%',
                    alignItems: 'center'
                }}>
                    <div style={{ padding: "1rem" }}>
                        {title && <h3 className="card-title">{title}</h3>}

                        {description && <p className="card-description">
                            {description.length > 150 ? description.slice(0, 100) + "..." : description}
                        </p>}

                        <div className="card-subinfo">
                            <span className="card-location">{location}</span>
                            <span className="card-date">{displayDate}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* daca exista imagine, textul merge normal sub imagine */}
            {firstImage && (
                <div className="card-body">
                    {title && <h3 className="card-title">{title}</h3>}

                    {description && <p className="card-description">
                        {description.length > 150 ? description.slice(0, 100) + "..." : description}
                    </p>}

                    <div className="card-subinfo">
                        <span className="card-location">{location}</span>
                        <span className="card-date">{displayDate}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostComponent;
