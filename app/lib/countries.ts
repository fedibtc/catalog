export const countryCodes = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
] as const
export type CountryCode = (typeof countryCodes)[number]

export const regionCodes = [
  'AF',
  'AS',
  'GLOBAL',
  'EU',
  'NA',
  'AU',
  'LA',
] as const

export type RegionCode = typeof regionCodes[number]

type RegionInfo = {
  displayName: string
}

export const regionsByRegionCode: Record<RegionCode, RegionInfo> = {
  AF: {
    displayName: "Africa",
  },
  AS: {
    displayName: "Asia",
  },
  EU: {
    displayName: "Europe",
  },
  GLOBAL: {
    displayName: 'Global',
  },
  NA: {
    displayName: "North America",
  },
  AU: {
    displayName: "Australia",
  },
  LA: {
    displayName: "Latin America",
  },
} as const

type CountryInfo = {
  displayName: string
  regionCode: RegionCode
}

export const countriesByCountryCode: Record<CountryCode, CountryInfo> = {
  AD: {
    displayName: "Andorra",
    regionCode: "EU",
  },
  AE: {
    displayName: "United Arab Emirates",
    regionCode: "AS",
  },
  AF: {
    displayName: "Afghanistan",
    regionCode: "AS",
  },
  AG: {
    displayName: "Antigua and Barbuda",
    regionCode: "NA",
  },
  AI: {
    displayName: "Anguilla",
    regionCode: "NA",
  },
  AL: {
    displayName: "Albania",
    regionCode: "EU",
  },
  AM: {
    displayName: "Armenia",
    regionCode: "AS",
  },
  AO: {
    displayName: "Angola",
    regionCode: "AF",
  },
  AR: {
    displayName: "Argentina",
    regionCode: "LA",
  },
  AS: {
    displayName: "American Samoa",
    regionCode: "AU",
  },
  AT: {
    displayName: "Austria",
    regionCode: "EU",
  },
  AU: {
    displayName: "Australia",
    regionCode: "AU",
  },
  AW: {
    displayName: "Aruba",
    regionCode: "NA",
  },
  AX: {
    displayName: "Aland",
    regionCode: "EU",
  },
  AZ: {
    displayName: "Azerbaijan",
    regionCode: "AS",
  },
  BA: {
    displayName: "Bosnia and Herzegovina",
    regionCode: "EU",
  },
  BB: {
    displayName: "Barbados",
    regionCode: "NA",
  },
  BD: {
    displayName: "Bangladesh",
    regionCode: "AS",
  },
  BE: {
    displayName: "Belgium",
    regionCode: "EU",
  },
  BF: {
    displayName: "Burkina Faso",
    regionCode: "AF",
  },
  BG: {
    displayName: "Bulgaria",
    regionCode: "EU",
  },
  BH: {
    displayName: "Bahrain",
    regionCode: "AS",
  },
  BI: {
    displayName: "Burundi",
    regionCode: "AF",
  },
  BJ: {
    displayName: "Benin",
    regionCode: "AF",
  },
  BL: {
    displayName: "Saint Barthelemy",
    regionCode: "NA",
  },
  BM: {
    displayName: "Bermuda",
    regionCode: "NA",
  },
  BN: {
    displayName: "Brunei",
    regionCode: "AS",
  },
  BO: {
    displayName: "Bolivia",
    regionCode: "LA",
  },
  BQ: {
    displayName: "Bonaire",
    regionCode: "NA",
  },
  BR: {
    displayName: "Brazil",
    regionCode: "LA",
  },
  BS: {
    displayName: "Bahamas",
    regionCode: "NA",
  },
  BT: {
    displayName: "Bhutan",
    regionCode: "AS",
  },
  BW: {
    displayName: "Botswana",
    regionCode: "AF",
  },
  BY: {
    displayName: "Belarus",
    regionCode: "EU",
  },
  BZ: {
    displayName: "Belize",
    regionCode: "NA",
  },
  CA: {
    displayName: "Canada",
    regionCode: "NA",
  },
  CC: {
    displayName: "Cocos (Keeling) Islands",
    regionCode: "AS",
  },
  CD: {
    displayName: "Democratic Republic of the Congo",
    regionCode: "AF",
  },
  CF: {
    displayName: "Central African Republic",
    regionCode: "AF",
  },
  CG: {
    displayName: "Republic of the Congo",
    regionCode: "AF",
  },
  CH: {
    displayName: "Switzerland",
    regionCode: "EU",
  },
  CI: {
    displayName: "Ivory Coast",
    regionCode: "AF",
  },
  CK: {
    displayName: "Cook Islands",
    regionCode: "AU",
  },
  CL: {
    displayName: "Chile",
    regionCode: "LA",
  },
  CM: {
    displayName: "Cameroon",
    regionCode: "AF",
  },
  CN: {
    displayName: "China",
    regionCode: "AS",
  },
  CO: {
    displayName: "Colombia",
    regionCode: "LA",
  },
  CR: {
    displayName: "Costa Rica",
    regionCode: "NA",
  },
  CU: {
    displayName: "Cuba",
    regionCode: "NA",
  },
  CV: {
    displayName: "Cape Verde",
    regionCode: "AF",
  },
  CW: {
    displayName: "Curacao",
    regionCode: "NA",
  },
  CX: {
    displayName: "Christmas Island",
    regionCode: "AS",
  },
  CY: {
    displayName: "Cyprus",
    regionCode: "EU",
  },
  CZ: {
    displayName: "Czech Republic",
    regionCode: "EU",
  },
  DE: {
    displayName: "Germany",
    regionCode: "EU",
  },
  DJ: {
    displayName: "Djibouti",
    regionCode: "AF",
  },
  DK: {
    displayName: "Denmark",
    regionCode: "EU",
  },
  DM: {
    displayName: "Dominica",
    regionCode: "NA",
  },
  DO: {
    displayName: "Dominican Republic",
    regionCode: "NA",
  },
  DZ: {
    displayName: "Algeria",
    regionCode: "AF",
  },
  EC: {
    displayName: "Ecuador",
    regionCode: "LA",
  },
  EE: {
    displayName: "Estonia",
    regionCode: "EU",
  },
  EG: {
    displayName: "Egypt",
    regionCode: "AF",
  },
  EH: {
    displayName: "Western Sahara",
    regionCode: "AF",
  },
  ER: {
    displayName: "Eritrea",
    regionCode: "AF",
  },
  ES: {
    displayName: "Spain",
    regionCode: "EU",
  },
  ET: {
    displayName: "Ethiopia",
    regionCode: "AF",
  },
  FI: {
    displayName: "Finland",
    regionCode: "EU",
  },
  FJ: {
    displayName: "Fiji",
    regionCode: "AU",
  },
  FK: {
    displayName: "Falkland Islands",
    regionCode: "LA",
  },
  FM: {
    displayName: "Micronesia",
    regionCode: "AU",
  },
  FO: {
    displayName: "Faroe Islands",
    regionCode: "EU",
  },
  FR: {
    displayName: "France",
    regionCode: "EU",
  },
  GA: {
    displayName: "Gabon",
    regionCode: "AF",
  },
  GB: {
    displayName: "United Kingdom",
    regionCode: "EU",
  },
  GD: {
    displayName: "Grenada",
    regionCode: "NA",
  },
  GE: {
    displayName: "Georgia",
    regionCode: "AS",
  },
  GF: {
    displayName: "French Guiana",
    regionCode: "LA",
  },
  GG: {
    displayName: "Guernsey",
    regionCode: "EU",
  },
  GH: {
    displayName: "Ghana",
    regionCode: "AF",
  },
  GI: {
    displayName: "Gibraltar",
    regionCode: "EU",
  },
  GL: {
    displayName: "Greenland",
    regionCode: "NA",
  },
  GM: {
    displayName: "Gambia",
    regionCode: "AF",
  },
  GN: {
    displayName: "Guinea",
    regionCode: "AF",
  },
  GP: {
    displayName: "Guadeloupe",
    regionCode: "NA",
  },
  GQ: {
    displayName: "Equatorial Guinea",
    regionCode: "AF",
  },
  GR: {
    displayName: "Greece",
    regionCode: "EU",
  },
  GT: {
    displayName: "Guatemala",
    regionCode: "NA",
  },
  GU: {
    displayName: "Guam",
    regionCode: "AU",
  },
  GW: {
    displayName: "Guinea-Bissau",
    regionCode: "AF",
  },
  GY: {
    displayName: "Guyana",
    regionCode: "LA",
  },
  HK: {
    displayName: "Hong Kong",
    regionCode: "AS",
  },
  HN: {
    displayName: "Honduras",
    regionCode: "NA",
  },
  HR: {
    displayName: "Croatia",
    regionCode: "EU",
  },
  HT: {
    displayName: "Haiti",
    regionCode: "NA",
  },
  HU: {
    displayName: "Hungary",
    regionCode: "EU",
  },
  ID: {
    displayName: "Indonesia",
    regionCode: "AS",
  },
  IE: {
    displayName: "Ireland",
    regionCode: "EU",
  },
  IL: {
    displayName: "Israel",
    regionCode: "AS",
  },
  IM: {
    displayName: "Isle of Man",
    regionCode: "EU",
  },
  IN: {
    displayName: "India",
    regionCode: "AS",
  },
  IO: {
    displayName: "British Indian Ocean Territory",
    regionCode: "AS",
  },
  IQ: {
    displayName: "Iraq",
    regionCode: "AS",
  },
  IR: {
    displayName: "Iran",
    regionCode: "AS",
  },
  IS: {
    displayName: "Iceland",
    regionCode: "EU",
  },
  IT: {
    displayName: "Italy",
    regionCode: "EU",
  },
  JE: {
    displayName: "Jersey",
    regionCode: "EU",
  },
  JM: {
    displayName: "Jamaica",
    regionCode: "NA",
  },
  JO: {
    displayName: "Jordan",
    regionCode: "AS",
  },
  JP: {
    displayName: "Japan",
    regionCode: "AS",
  },
  KE: {
    displayName: "Kenya",
    regionCode: "AF",
  },
  KG: {
    displayName: "Kyrgyzstan",
    regionCode: "AS",
  },
  KH: {
    displayName: "Cambodia",
    regionCode: "AS",
  },
  KI: {
    displayName: "Kiribati",
    regionCode: "AU",
  },
  KM: {
    displayName: "Comoros",
    regionCode: "AF",
  },
  KN: {
    displayName: "Saint Kitts and Nevis",
    regionCode: "NA",
  },
  KP: {
    displayName: "North Korea",
    regionCode: "AS",
  },
  KR: {
    displayName: "South Korea",
    regionCode: "AS",
  },
  KW: {
    displayName: "Kuwait",
    regionCode: "AS",
  },
  KY: {
    displayName: "Cayman Islands",
    regionCode: "NA",
  },
  KZ: {
    displayName: "Kazakhstan",
    regionCode: "AS",
  },
  LA: {
    displayName: "Laos",
    regionCode: "AS",
  },
  LB: {
    displayName: "Lebanon",
    regionCode: "AS",
  },
  LC: {
    displayName: "Saint Lucia",
    regionCode: "NA",
  },
  LI: {
    displayName: "Liechtenstein",
    regionCode: "EU",
  },
  LK: {
    displayName: "Sri Lanka",
    regionCode: "AS",
  },
  LR: {
    displayName: "Liberia",
    regionCode: "AF",
  },
  LS: {
    displayName: "Lesotho",
    regionCode: "AF",
  },
  LT: {
    displayName: "Lithuania",
    regionCode: "EU",
  },
  LU: {
    displayName: "Luxembourg",
    regionCode: "EU",
  },
  LV: {
    displayName: "Latvia",
    regionCode: "EU",
  },
  LY: {
    displayName: "Libya",
    regionCode: "AF",
  },
  MA: {
    displayName: "Morocco",
    regionCode: "AF",
  },
  MC: {
    displayName: "Monaco",
    regionCode: "EU",
  },
  MD: {
    displayName: "Moldova",
    regionCode: "EU",
  },
  ME: {
    displayName: "Montenegro",
    regionCode: "EU",
  },
  MF: {
    displayName: "Saint Martin",
    regionCode: "NA",
  },
  MG: {
    displayName: "Madagascar",
    regionCode: "AF",
  },
  MH: {
    displayName: "Marshall Islands",
    regionCode: "AU",
  },
  MK: {
    displayName: "North Macedonia",
    regionCode: "EU",
  },
  ML: {
    displayName: "Mali",
    regionCode: "AF",
  },
  MM: {
    displayName: "Myanmar (Burma)",
    regionCode: "AS",
  },
  MN: {
    displayName: "Mongolia",
    regionCode: "AS",
  },
  MO: {
    displayName: "Macao",
    regionCode: "AS",
  },
  MP: {
    displayName: "Northern Mariana Islands",
    regionCode: "AU",
  },
  MQ: {
    displayName: "Martinique",
    regionCode: "NA",
  },
  MR: {
    displayName: "Mauritania",
    regionCode: "AF",
  },
  MS: {
    displayName: "Montserrat",
    regionCode: "NA",
  },
  MT: {
    displayName: "Malta",
    regionCode: "EU",
  },
  MU: {
    displayName: "Mauritius",
    regionCode: "AF",
  },
  MV: {
    displayName: "Maldives",
    regionCode: "AS",
  },
  MW: {
    displayName: "Malawi",
    regionCode: "AF",
  },
  MX: {
    displayName: "Mexico",
    regionCode: "NA",
  },
  MY: {
    displayName: "Malaysia",
    regionCode: "AS",
  },
  MZ: {
    displayName: "Mozambique",
    regionCode: "AF",
  },
  NA: {
    displayName: "Namibia",
    regionCode: "AF",
  },
  NC: {
    displayName: "New Caledonia",
    regionCode: "AU",
  },
  NE: {
    displayName: "Niger",
    regionCode: "AF",
  },
  NF: {
    displayName: "Norfolk Island",
    regionCode: "AU",
  },
  NG: {
    displayName: "Nigeria",
    regionCode: "AF",
  },
  NI: {
    displayName: "Nicaragua",
    regionCode: "NA",
  },
  NL: {
    displayName: "Netherlands",
    regionCode: "EU",
  },
  NO: {
    displayName: "Norway",
    regionCode: "EU",
  },
  NP: {
    displayName: "Nepal",
    regionCode: "AS",
  },
  NR: {
    displayName: "Nauru",
    regionCode: "AU",
  },
  NU: {
    displayName: "Niue",
    regionCode: "AU",
  },
  NZ: {
    displayName: "New Zealand",
    regionCode: "AU",
  },
  OM: {
    displayName: "Oman",
    regionCode: "AS",
  },
  PA: {
    displayName: "Panama",
    regionCode: "NA",
  },
  PE: {
    displayName: "Peru",
    regionCode: "LA",
  },
  PF: {
    displayName: "French Polynesia",
    regionCode: "AU",
  },
  PG: {
    displayName: "Papua New Guinea",
    regionCode: "AU",
  },
  PH: {
    displayName: "Philippines",
    regionCode: "AS",
  },
  PK: {
    displayName: "Pakistan",
    regionCode: "AS",
  },
  PL: {
    displayName: "Poland",
    regionCode: "EU",
  },
  PM: {
    displayName: "Saint Pierre and Miquelon",
    regionCode: "NA",
  },
  PN: {
    displayName: "Pitcairn Islands",
    regionCode: "AU",
  },
  PR: {
    displayName: "Puerto Rico",
    regionCode: "NA",
  },
  PS: {
    displayName: "Palestine",
    regionCode: "AS",
  },
  PT: {
    displayName: "Portugal",
    regionCode: "EU",
  },
  PW: {
    displayName: "Palau",
    regionCode: "AU",
  },
  PY: {
    displayName: "Paraguay",
    regionCode: "LA",
  },
  QA: {
    displayName: "Qatar",
    regionCode: "AS",
  },
  RE: {
    displayName: "Reunion",
    regionCode: "AF",
  },
  RO: {
    displayName: "Romania",
    regionCode: "EU",
  },
  RS: {
    displayName: "Serbia",
    regionCode: "EU",
  },
  RU: {
    displayName: "Russia",
    regionCode: "AS",
  },
  RW: {
    displayName: "Rwanda",
    regionCode: "AF",
  },
  SA: {
    displayName: "Saudi Arabia",
    regionCode: "AS",
  },
  SB: {
    displayName: "Solomon Islands",
    regionCode: "AU",
  },
  SC: {
    displayName: "Seychelles",
    regionCode: "AF",
  },
  SD: {
    displayName: "Sudan",
    regionCode: "AF",
  },
  SE: {
    displayName: "Sweden",
    regionCode: "EU",
  },
  SG: {
    displayName: "Singapore",
    regionCode: "AS",
  },
  SH: {
    displayName: "Saint Helena",
    regionCode: "AF",
  },
  SI: {
    displayName: "Slovenia",
    regionCode: "EU",
  },
  SJ: {
    displayName: "Svalbard and Jan Mayen",
    regionCode: "EU",
  },
  SK: {
    displayName: "Slovakia",
    regionCode: "EU",
  },
  SL: {
    displayName: "Sierra Leone",
    regionCode: "AF",
  },
  SM: {
    displayName: "San Marino",
    regionCode: "EU",
  },
  SN: {
    displayName: "Senegal",
    regionCode: "AF",
  },
  SO: {
    displayName: "Somalia",
    regionCode: "AF",
  },
  SR: {
    displayName: "Suriname",
    regionCode: "LA",
  },
  SS: {
    displayName: "South Sudan",
    regionCode: "AF",
  },
  ST: {
    displayName: "Sao Tome and Principe",
    regionCode: "AF",
  },
  SV: {
    displayName: "El Salvador",
    regionCode: "NA",
  },
  SX: {
    displayName: "Sint Maarten",
    regionCode: "NA",
  },
  SY: {
    displayName: "Syria",
    regionCode: "AS",
  },
  SZ: {
    displayName: "Eswatini",
    regionCode: "AF",
  },
  TC: {
    displayName: "Turks and Caicos Islands",
    regionCode: "NA",
  },
  TD: {
    displayName: "Chad",
    regionCode: "AF",
  },
  TG: {
    displayName: "Togo",
    regionCode: "AF",
  },
  TH: {
    displayName: "Thailand",
    regionCode: "AS",
  },
  TJ: {
    displayName: "Tajikistan",
    regionCode: "AS",
  },
  TK: {
    displayName: "Tokelau",
    regionCode: "AU",
  },
  TL: {
    displayName: "East Timor",
    regionCode: "AU",
  },
  TM: {
    displayName: "Turkmenistan",
    regionCode: "AS",
  },
  TN: {
    displayName: "Tunisia",
    regionCode: "AF",
  },
  TO: {
    displayName: "Tonga",
    regionCode: "AU",
  },
  TR: {
    displayName: "Turkey",
    regionCode: "AS",
  },
  TT: {
    displayName: "Trinidad and Tobago",
    regionCode: "NA",
  },
  TV: {
    displayName: "Tuvalu",
    regionCode: "AU",
  },
  TW: {
    displayName: "Taiwan",
    regionCode: "AS",
  },
  TZ: {
    displayName: "Tanzania",
    regionCode: "AF",
  },
  UA: {
    displayName: "Ukraine",
    regionCode: "EU",
  },
  UG: {
    displayName: "Uganda",
    regionCode: "AF",
  },
  UM: {
    displayName: "U.S. Minor Outlying Islands",
    regionCode: "AU",
  },
  US: {
    displayName: "United States",
    regionCode: "NA",
  },
  UY: {
    displayName: "Uruguay",
    regionCode: "LA",
  },
  UZ: {
    displayName: "Uzbekistan",
    regionCode: "AS",
  },
  VA: {
    displayName: "Vatican City",
    regionCode: "EU",
  },
  VC: {
    displayName: "Saint Vincent and the Grenadines",
    regionCode: "NA",
  },
  VE: {
    displayName: "Venezuela",
    regionCode: "LA",
  },
  VG: {
    displayName: "British Virgin Islands",
    regionCode: "NA",
  },
  VI: {
    displayName: "U.S. Virgin Islands",
    regionCode: "NA",
  },
  VN: {
    displayName: "Vietnam",
    regionCode: "AS",
  },
  VU: {
    displayName: "Vanuatu",
    regionCode: "AU",
  },
  WF: {
    displayName: "Wallis and Futuna",
    regionCode: "AU",
  },
  WS: {
    displayName: "Samoa",
    regionCode: "AU",
  },
  XK: {
    displayName: "Kosovo",
    regionCode: "EU",
  },
  YE: {
    displayName: "Yemen",
    regionCode: "AS",
  },
  YT: {
    displayName: "Mayotte",
    regionCode: "AF",
  },
  ZA: {
    displayName: "South Africa",
    regionCode: "AF",
  },
  ZM: {
    displayName: "Zambia",
    regionCode: "AF",
  },
  ZW: {
    displayName: "Zimbabwe",
    regionCode: "AF",
  },
}

export const isCountryInRegion = (countryCode: CountryCode, regionCode: RegionCode): boolean => {
  return countriesByCountryCode[countryCode].regionCode === regionCode
}