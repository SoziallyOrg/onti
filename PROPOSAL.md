# Voorstel — Intern onderhoudssysteem voor Onti Banden

**Datum:** 19 mei 2026
**Geldig tot:** 30 dagen na bovenstaande datum
**Voor:** Onti Banden

---

## 1. Wat we gaan bouwen

Een eenvoudig, snel en praktisch webgebaseerd systeem dat fungeert als het **technisch geheugen** van Onti Banden. Eén centrale plek waar alle onderhoudshistoriek, gebruikte onderdelen en OEM-nummers per voertuig bijgehouden worden.

Het belangrijkste werkpunt: wanneer een wagen terugkomt, typ je de nummerplaat of het chassisnummer in en zie je meteen wat er vorige keer gemonteerd werd, welke merken gebruikt zijn en bij welke leverancier de onderdelen besteld werden.

---

## 2. Wat het systeem voor je doet

### Voertuigen
- Voertuigfiche per wagen met nummerplaat, VIN, merk, model, motor, bouwjaar, klantnaam en GSM-nummer.
- Zoeken op nummerplaat **of** chassisnummer in één zoekbalk, met tikfout-tolerantie.
- Resultaat zichtbaar binnen één seconde, ook op een gsm of tablet in de werkplaats.

### Onderhoudsbeurten
- Per beurt: datum, kilometerstand, olietype, aantal liter, technische opmerkingen.
- Onbeperkt aantal onderdelen per beurt: filter (olie/lucht/cabine/brandstof), remblok, remschijf of "andere".
- Per onderdeel: categorie, OEM/OEN-nummer, merk, leverancier en eventueel een nota.
- Automatische suggesties bij OEM-nummers en merken op basis van vorige beurten — minder typwerk, minder tikfouten.

### Foto's
- Optioneel foto's bij een onderhoudsbeurt toevoegen (bv. foto van een versleten remblok als bewijs voor de klant).
- Direct uploaden vanaf een smartphone in de werkplaats.

### Gebruikers
- Eén beheerder (eigenaar) die gebruikersaccounts aanmaakt en wachtwoorden kan resetten.
- Meerdere monteurs met eigen login.
- Geen publieke registratie — enkel interne gebruikers.

### Export
- Eén klik om alle voertuigen, onderhoudsbeurten of onderdelen naar Excel/CSV te exporteren.

### Toegang
- Werkt op pc, tablet en smartphone via dezelfde URL.
- Beveiligde verbinding (HTTPS) op een eigen domeinnaam.

---

## 3. Hoe het gebouwd en gehost wordt

- **Eigen Hostinger VPS** — geen abonnementsleverancier, geen plotse prijsverhogingen, alle data blijft eigendom van Onti Banden.
- **Aparte domeinnaam** — bv. `ontigarage.be` of een naam naar keuze, te registreren door Onti Banden zelf.
- **Beveiliging** — HTTPS-certificaten met automatische verlenging, gehashte wachtwoorden, sessiebeveiliging, firewall op de server.
- **Dagelijkse versleutelde back-ups** naar een externe locatie (Backblaze B2). 30 dagen historiek. Maandelijks getest met een echte herstelproef.
- **Hersteltijd** — bij een crash van de VPS is het systeem binnen 2 uur weer operationeel op een nieuwe machine, met maximaal 24 uur dataverlies.

---

## 4. Investering

| | Bedrag (excl. 21% btw) |
|---|---|
| **Eenmalige ontwikkeling** | **€4.375** |
| **Onderhoud & ondersteuning per maand** | **€150** |
| Domeinnaam (jaarlijks, rechtstreeks bij registrar) | ± €15 |
| Cloud back-up opslag | gratis (Backblaze B2 free tier) |

Bedragen worden vermeerderd met 21% btw.

### Wat zit er in de eenmalige €4.375?

| Onderdeel | Inbegrepen |
|---|---|
| Analyse, ontwerp en projectbegeleiding | Ja |
| Volledige ontwikkeling van het systeem (alle functies hierboven) | Ja |
| Foto-uploads bij onderhoudsbeurten | Ja |
| Beveiligde login en gebruikersbeheer | Ja |
| Installatie op de Hostinger VPS, inclusief firewall en HTTPS | Ja |
| Configuratie van automatische versleutelde back-ups | Ja |
| Test van het volledige back-up- en herstelproces vóór oplevering | Ja |
| Eén opleidingssessie van 1 uur (op locatie of online) | Ja |
| Schriftelijke handleiding in het Nederlands | Ja |
| 30 dagen gratis nazorg na oplevering voor bugfixes | Ja |

### Waarom deze prijs?

Maatwerk is geen abonnement. Een vergelijkbaar bestaand systeem als SaaS (bv. een garage management platform) kost al snel **€60–€100 per gebruiker per maand**. Voor 3 gebruikers is dat €2.160 tot €3.600 **per jaar**, en dat 5 jaar lang komt neer op €10.800 tot €18.000. Bovendien blijft de data dan eigendom van de leverancier.

Met dit voorstel betaal je eenmalig de bouw, blijft alles eigendom van Onti Banden, en is er geen risico op plotse prijsverhogingen of een leverancier die de stekker uittrekt.

Concreet zit in de eenmalige prijs:
- Ongeveer 7 werkdagen ontwikkeling op maat.
- Volledige opzet en beveiliging van de server (geen losse rekening voor "installatiekosten").
- Een correct opgezet, geteste back-up systeem — zodat een verloren computer of een crash nooit klantdata kost.
- Persoonlijke opleiding en een Nederlandstalige handleiding.
- Een maand gratis nazorg om de kleine dingen die in de praktijk opduiken meteen recht te trekken.

Dit is een eerlijk middensegment tarief voor maatwerk in Vlaanderen door een ervaren ontwikkelaar — niet de goedkoopste, niet de duurste, wel iemand die het project van begin tot einde zelf opvolgt.

### Wat zit er in de €150 per maand?

| Onderdeel | Inbegrepen |
|---|---|
| **2 uur per maand** voor kleine aanpassingen, vragen of bugfixes | Ja |
| Maandelijkse veiligheidsupdates van de server | Ja |
| Maandelijkse herstelproef van de back-ups | Ja |
| Monitoring dat de dagelijkse back-up effectief uitgevoerd is | Ja |
| Verlenging van HTTPS-certificaten en domeinconfiguratie | Ja |
| Updates van de softwarebibliotheken bij beveiligingsmeldingen | Ja |
| Reactie binnen 2 werkdagen op support-vragen via e-mail | Ja |

Werk dat boven de 2 inbegrepen uren gaat, wordt aangerekend aan **€95/uur** in blokken van 15 minuten. Niet-inbegrepen zijn nieuwe functionaliteiten (zie volgende sectie).

### Waarom een maandelijkse vergoeding?

Een online systeem onderhoudt zichzelf niet. Servers krijgen veiligheidsupdates, certificaten verlopen, software-bibliotheken worden bijgewerkt, en back-ups moeten **actief** gecontroleerd en getest worden. Een back-up die nooit getest is, is geen back-up.

Het maandbedrag zorgt dat dit consistent en voorspelbaar gebeurt — zonder dat Onti Banden moet afwachten tot er iets misgaat. Het alternatief is werken aan €95/uur **zonder reactietijd-garantie**: in de praktijk duurder zodra er iets ernstig stuk gaat, en stresserend voor jou wanneer dat moment komt.

---

## 5. Niet inbegrepen (mogelijk in een latere fase)

Deze functies houden we expliciet buiten dit eerste systeem om de scope eenvoudig te houden. Ze kunnen later afzonderlijk geofferd worden:

- Afsprakenkalender / planning
- SMS- of e-mailherinneringen voor klanten
- Klantenportaal (waar de klant zelf de historiek kan inkijken)
- Facturatiekoppeling of voorraadbeheer
- Koppeling met onderdelenleveranciers (TecDoc, …)
- Rapportering / dashboards

---

## 6. Tijdslijn

| Mijlpaal | Termijn |
|---|---|
| Ondertekening offerte + voorschot | Dag 0 |
| Eerste werkende versie online (testlink) | Week 2 |
| Oplevering, opleiding en go-live | Week 3 |
| Einde gratis nazorgperiode | Week 7 |

Voorwaarde voor deze termijn: domeinnaam geregistreerd en VPS-toegang beschikbaar binnen de eerste week.

---

## 7. Betalingsvoorwaarden

| Schijf | Bedrag (excl. btw) | Wanneer |
|---|---|---|
| 40% voorschot | €1.750 | Bij ondertekening |
| 40% bij eerste live versie | €1.750 | Bij oplevering testlink |
| 20% bij definitieve oplevering | €875 | Na opleiding en go-live |

Betalingstermijn: **14 dagen** na factuurdatum. Maandelijkse onderhoudsfactuur start de maand **na** go-live.

---

## 8. Volgende stappen

1. Akkoord met deze offerte → ondertekenen of bevestigen per e-mail.
2. Onti Banden registreert de gewenste domeinnaam.
3. Ontwikkeling start binnen 5 werkdagen na ontvangst van het voorschot.
4. Wekelijkse korte update tijdens de bouw.

---

**Vragen of opmerkingen?** Liever eerst even bellen of mailen voor we tekenen — een goed begin is alles waard.

---

*Deze offerte is opgesteld op basis van het functioneel overzicht in de begeleidende specificatie. Wijzigingen aan de scope worden in onderling overleg ingepland en, indien van toepassing, afzonderlijk geofferd.*
