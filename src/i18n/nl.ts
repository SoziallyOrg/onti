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

  errors: {
    unknown: "Er ging iets mis. Probeer opnieuw.",
    forbidden: "Geen toegang tot deze pagina.",
  },
} as const;
