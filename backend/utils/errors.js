// asta este o eroare „publica”: parametrul publicMessage contine mesajul care va fi vizibil utilizatorilor
// in erori, mesajul din err.message este pentru devs si poate contine detalii tehnice
// Daca apare o eroare legata de sistem si nu are publicMessage, utilizatorul nu va vedea detalii sensibile, ci doar un mesaj default
// afisarea se face in errorHandler
export const createPublicError = (message, status = 500) => {
    const err = new Error(message);
    err.status = status;
    err.publicMessage = message;
    return err;
};
