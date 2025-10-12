import "../styles/post.css";
import { FaRegCalendarAlt } from "react-icons/fa";

const PostComponent = ({ type, images, title, location, dateTime, description, onClick }) => {
    const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
    const displayDate = dateTime
        ? new Date(dateTime).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "";

    const typeColor = type === "found" ? "orange" : type === "lost" ? "red" : "#45a049";

    return (
        <div className="post-card" onClick={onClick}>
            <div className="type-indicator" style={{ backgroundColor: typeColor }}>
                {type == "lost" ? "Pierdut" : type == "found" ? "Găsit" : "Rezolvat"}
            </div>

            {firstImage ? (
                <img src={firstImage} alt={title} className="card-image" />
            ) : ( //daca nu avem poza se afiseaza asta
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',  // vertical
                    width: '100%',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <div style={{ padding: "1rem" }}>
                        {title && <h3>{title}</h3>}

                        {description && <p className="card-description">
                            {description.length > 150 ? description.slice(0, 100) + "..." : description}
                        </p>}

                        <div className="card-subinfo">
                            <span className="card-location">
                                📍
                                {location}
                            </span>
                            {dateTime && (<span className="card-date">
                                <FaRegCalendarAlt color="blue" size={14} />
                                {displayDate}
                            </span>)}

                        </div>
                    </div>
                </div>
            )}

            {/* daca exista imagine, textul merge normal sub imagine */}
            {firstImage && (
                <div className="card-body">
                    {title && <h3>{title}</h3>}

                    {description && <p className="card-description">
                        {description.length > 150 ? description.slice(0, 100) + "..." : description}
                    </p>}

                    <div className="card-subinfo">
                        <span className="card-location">
                            📍
                            {location}
                        </span>
                        {displayDate && (
                            <span className="card-date">
                                <FaRegCalendarAlt color="blue" size={14} />
                                {displayDate}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostComponent;
