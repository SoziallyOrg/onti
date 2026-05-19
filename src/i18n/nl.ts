/**
 * Centralized Dutch labels.
 *
 * Internal app, single language → no real i18n framework needed. Keeping
 * strings together makes it easy to grep and to consistently use Belgian
 * Dutch (e.g. "GSM", "nummerplaat") instead of NL-NL alternatives.
 */
export const t = {
  app: {
    name: "Onti Garage",
    tagline: "Intern onderhoudssysteem",
  },

  nav: {
    home: "Start",
    vehicles: "Voertuigen",
    admin: "Beheer",
    users: "Gebruikers",
    signOut: "Afmelden",
  },

  auth: {
    loginTitle: "Aanmelden",
    loginSubtitle: "Toegang voor medewerkers van Onti Banden.",
    email: "E-mailadres",
    password: "Wachtwoord",
    submit: "Aanmelden",
    submitting: "Bezig…",
    invalidCredentials: "Ongeldig e-mailadres of wachtwoord.",
    sessionExpired: "Sessie verlopen — meld opnieuw aan.",
    signedOut: "Afgemeld.",
  },

  users: {
    title: "Gebruikers",
    subtitle: "Alleen beheerders kunnen gebruikers aanmaken of deactiveren.",
    new: "Nieuwe gebruiker",
    name: "Naam",
    role: "Rol",
    status: "Status",
    actions: "Acties",
    active: "Actief",
    inactive: "Gedeactiveerd",
    deactivate: "Deactiveren",
    activate: "Heractiveren",
    resetPassword: "Wachtwoord resetten",
    create: "Gebruiker aanmaken",
    creating: "Bezig…",
    cancel: "Annuleren",
    save: "Bewaren",
    nonePlaceholder: "Nog geen gebruikers — voeg er een toe.",
    cannotDeactivateSelf: "Je kan je eigen account niet deactiveren.",
    roleAdmin: "Beheerder",
    roleMechanic: "Monteur",
  },

  search: {
    label: "Zoek voertuig",
    placeholder: "Nummerplaat of VIN…",
    noResults: "Geen voertuigen gevonden.",
    resultsFor: (q: string) => `Resultaten voor “${q}”`,
  },

  vehicles: {
    title: "Voertuigen",
    new: "Nieuwe wagen",
    edit: "Bewerken",
    archive: "Archiveren",
    unarchive: "Heractiveren",
    archived: "Gearchiveerd",
    backToList: "← Voertuigen",
    backToVehicle: "← Terug naar wagen",
    detailMissing: "Wagen niet gevonden.",
    fields: {
      vin: "Chassisnummer (VIN)",
      plate: "Nummerplaat",
      make: "Merk",
      model: "Model",
      engine: "Motor",
      modelYear: "Bouwjaar",
      customerName: "Klantnaam",
      customerPhone: "GSM",
    },
    hints: {
      vin: "11 tot 17 tekens, hoofdletters en cijfers (geen I, O of Q).",
      plate: "Bv. 1-ABC-123. Wordt automatisch in hoofdletters omgezet.",
    },
    list: {
      empty: "Nog geen voertuigen — voeg de eerste toe.",
      recent: "Laatst bewerkt",
      countOne: "1 wagen",
      countMany: (n: number) => `${n} wagens`,
    },
    detail: {
      timelineTitle: "Onderhoudshistoriek",
      timelineEmpty:
        "Nog geen onderhoudsbeurten geregistreerd. Beschikbaar in de volgende update.",
      addEntry: "Onderhoud toevoegen",
    },
    actions: {
      created: "Wagen toegevoegd.",
      updated: "Wijzigingen bewaard.",
      archived: "Wagen gearchiveerd.",
      unarchived: "Wagen geheractiveerd.",
      vinExists: "Een wagen met dit chassisnummer bestaat al.",
    },
  },

  errors: {
    unknown: "Er ging iets mis. Probeer opnieuw.",
    forbidden: "Geen toegang tot deze pagina.",
    notFound: "Niet gevonden.",
  },
} as const;
