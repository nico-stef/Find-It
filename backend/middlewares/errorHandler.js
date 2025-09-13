export const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message); //asta vede doar dev-ul

    const status = err.status || 500;
    const message = err.publicMessage || "Internal Server Error"; //publicMessage e mesajul adresat user-ului incat sa nu dezvaluie prea mult despre eroare

    res.status(status).json({ message });
}