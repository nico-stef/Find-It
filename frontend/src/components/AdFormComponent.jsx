import { useState, useEffect, useRef } from "react";
import '../styles/adForm.css'
import { FaUpload } from 'react-icons/fa'
import axios from 'axios';
import { toast } from "react-hot-toast";

const AdFormComponent = ({ onClose }) => {
    const initialFormData = {
        type: "lost",
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
        contact: "",
        selectedFiles: null
    };
    const [formData, setFormData] = useState(initialFormData);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);//locatia trimisa pe backend e valida doar daca e aleasa din
    //lista de la maps api si are un placeId
    const [locationError, setLocationError] = useState("");
    const suggestionsRef = useRef(null);
    const [showTimeError, setShowTimeError] = useState(false);

    //cand deschidem modalul cu formularul, adaugam o clasa, ca atunci cand e activa, overflow-ul sa fie hidden si sa nu exista scrollbar
    useEffect(() => {
        document.body.classList.add("modal-open");
        return () => document.body.classList.remove("modal-open"); //se execută automat atunci când componenta se demontează (dispare din DOM)
    }, []);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (e.target.type === "file") {
            setFormData((prev) => ({
                ...prev,
                [name]: Array.from(files), // salvam toate fisierele ca array
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Daca user-ul a selectat o data, poate selecta si ora acum. mesajul de eroare cum ca trebuie selectata o data prima data, nu mai apare
        if (name === "date" && value) {
            setShowTimeError(false);
        }


        if (name === "location") {
            setSelectedPlaceId(null);

            if (value.length < 3) {
                return;
            }
            try {
                const res = await axios.get("http://localhost:3000/locationsAutocomplete", {
                    params: { input: value },
                    withCredentials: true
                });
                setLocationSuggestions(res.data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    //pentru click in afara dropdownului de la sugestii locatii
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setLocationSuggestions([]); // golim sugestiile
            }
        };
        //este 'activat' acest event listener cand se intra pe pagina si asculta click-urile
        //cand iesim de pe pagina asta, va fi dezactivat
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        console.log("FormData s-a schimbat:", formData.date, formData.time);
    }, [formData]);

    const handleTimeClick = () => {
        if (!formData.date) {
            setShowTimeError(true); // afișăm mesajul doar dacă nu există data
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPlaceId) {
            setLocationError("Te rugăm să alegi o locație din lista de sugestii!");
            return;
        }
        setLocationError("");

        try {
            const dataToSend = new FormData();
            dataToSend.append("type", formData.type);
            dataToSend.append("title", formData.title);
            dataToSend.append("place_id", selectedPlaceId);

            let dateTimeValue = null;
            if (formData.date) {// daca exista data, o alipim la ora aleasa. daca nu a fost aleasa o ora, se salveaza mizeul noptii
                const timePart = formData.time ? formData.time : "00:00";
                dateTimeValue = `${formData.date}T${timePart}`;
            }
            if (dateTimeValue !== null) {
                dataToSend.append("dateTime", dateTimeValue);
            }

            dataToSend.append("description", formData.description);
            dataToSend.append("contact", formData.contact);

            // imaginile
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((file) => {
                    dataToSend.append("images", file); // "images" trebuie să corespunda cu multer / backend
                });
            }

            const response = await axios.post(`http://localhost:3000/post`,
                dataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );
            if (response.status === 201) {
                toast.success("Post creat cu succes!");
                setFormData(initialFormData);
                setSelectedPlaceId(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="form-wrapper">
            <button type="button" className="back-btn" onClick={onClose}>
                ← Înapoi
            </button>
            <form onSubmit={handleSubmit} className="form-container">

                <h2>Postează un anunț</h2>

                <div className="row">
                    <label>Tip</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="lost">Pierdut</option>
                        <option value="found">Găsit</option>
                    </select>
                </div>

                <div className="row">
                    <label>Titlu</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Portofel negru"
                        required
                    />
                </div>

                <div className="row">
                    <label>Locație</label>
                    <div className="input-location-wrapper" ref={suggestionsRef}>
                        {locationError && <p className="error-message">{locationError}</p>}
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Ex: București, Piața Unirii"
                            required
                        />
                        {locationSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {locationSuggestions.map((s) => (
                                    <li
                                        key={s.place_id}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, location: s.description }));
                                            setSelectedPlaceId(s.place_id);
                                            setLocationSuggestions([]);
                                        }}
                                    >
                                        {s.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="row">
                    <label style={{ display: 'flex', flexDirection: 'column' }}>
                        Data
                        <span className="optional">(opțional)</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <label style={{ display: 'flex', flexDirection: 'column' }}>
                        Ora
                        <span className="optional">(opțional)</span>
                    </label>
                    <div className="input-location-wrapper">
                        {showTimeError && (
                            <p className="error-message">
                                Trebuie să selectezi mai întâi data pentru a putea seta ora.
                            </p>
                        )}
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            readOnly={!formData.date} //poate fi completat doar daca alegi o data
                            onClick={handleTimeClick}
                        />
                    </div>
                </div>

                <div className="row">
                    <label>Imagini <span className="optional">(opțional)</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="images"
                        name="images"
                        onChange={handleChange}
                        className="customFileInput"
                        style={{ display: 'none' }} // ascunde input-ul real
                    />
                    <div
                        className="custom-file-label"
                        onClick={() => document.getElementById('images').click()} //simuleaza un click pe input-ul real, care e ascuns pt ca e urat
                    >
                        {(!formData.images?.length) && (
                            <>
                                <FaUpload className="upload-icon" />
                                <span className="upload-text">Alege fișier</span>
                            </>
                        )}


                        {formData.images && formData.images.length > 0 && (
                            <div className="preview-wrapper">
                                {formData.images.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="preview-img"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className="row">
                    <label>Descriere <span className="optional">(opțional)</span></label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detalii despre obiect..."
                    />
                </div>

                <div className="row">
                    <label>Date de contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Telefon, email, etc"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Postează anunț
                </button>
            </form>
        </div>
    );
}

export default AdFormComponent;