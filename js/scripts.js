
const tulokset = document.getElementById("json-tulokset");
const hakunappi = document.getElementById("hae-kirjat");

hakunappi.addEventListener("click", () => {
    tulokset.textContent = "Haetaan kirjavinkkejä...";
    hakunappi.disabled = true;

   const osoite = "https://gutendex.com/books/?search=fiction";

    fetch(osoite, {
    signal: AbortSignal.timeout(10000)
})
        .then(response => {
            if (!response.ok) {
                throw new Error("Kirjatietojen haku epäonnistui.");
            }
            return response.json();
        })
        .then(data => {
            tulokset.innerHTML = "";

            const sekoitetutKirjat = [...data.results]
            .sort(() => Math.random() - 0.5);

            const kirjat = sekoitetutKirjat.slice(0, 5);

            if (kirjat.length === 0) {
                tulokset.textContent = "Kirjoja ei löytynyt. Kokeile uudelleen.";
                return;
            }

            kirjat.forEach(kirja => {
                const kortti = document.createElement("div");
                kortti.className = "card mb-3 p-3";

                const nimi = document.createElement("h3");
                nimi.className = "h6 mb-2";
                nimi.textContent = kirja.title || "Nimetön kirja";

                const kirjailija = document.createElement("p");
                kirjailija.className = "mb-0";
                const nimet = kirja.authors
                    .map(tekija => tekija.name)
                    .join(", ");

                kirjailija.textContent =
                    "Kirjailija: " + (nimet || "Ei saatavilla");

                kortti.appendChild(nimi);
                kortti.appendChild(kirjailija);
                tulokset.appendChild(kortti);
            });
        })
        .catch(error => {
            tulokset.textContent =
                "Kirjavinkkien hakeminen ei onnistunut. Yritä uudelleen.";
            console.error(error);
        })
        .finally(() => {
            hakunappi.disabled = false;
        });
});
