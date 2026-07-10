/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

/**
 * This data was compiled from the [CLDR locale data](https://github.com/unicode-cldr/cldr-json).
 *
 * It includes at least the information about english (en).
 */
export interface CLDRData {
	en: {
		language: string;
		territory: string;
		territoryCode: string;
		numberFormat: NumberFormat;
		dateFormat: DateFormat;
		dateTimeFormat: DateTimeFormat;
		timeFormat: TimeFormat;
	};

	[key: string]:
		| {
				language: string;
				territory: string;
				territoryCode: string;
				numberFormat: NumberFormat;
				dateFormat: DateFormat;
				dateTimeFormat: DateTimeFormat;
				timeFormat: TimeFormat;
		  }
		| undefined;
}

export const CLDRData: CLDRData = {
	af: {
		language: "Afrikaans",
		territory: "South Africa",
		territoryCode: "ZA",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	am: {
		language: "Amharic",
		territory: "Ethiopia",
		territoryCode: "ET",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	ar: {
		language: "Arabic",
		territory: "World",
		territoryCode: "001",
		numberFormat: {
			decimalSeparator: "٫",
			thousandsSeparator: "٬"
		},
		dateFormat: {
			order: "DMY",
			separator: "‏",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd‏MM‏yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	be: {
		language: "Belarusian",
		territory: "Belarus",
		territoryCode: "BY",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	bg: {
		language: "Bulgarian",
		territory: "Bulgaria",
		territoryCode: "BG",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm 'ч'."
		},
		timeFormat: {
			timeFormat: "hh:mm 'ч'."
		}
	},
	bn: {
		language: "Bangla",
		territory: "Bangladesh",
		territoryCode: "BD",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	ca: {
		language: "Catalan",
		territory: "Spain",
		territoryCode: "ES",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	cs: {
		language: "Czech",
		territory: "Czechia",
		territoryCode: "CZ",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	cy: {
		language: "Welsh",
		territory: "United Kingdom",
		territoryCode: "GB",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	da: {
		language: "Danish",
		territory: "Denmark",
		territoryCode: "DK",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH.mm"
		},
		timeFormat: {
			timeFormat: "HH.mm"
		}
	},
	de: {
		language: "German",
		territory: "Germany",
		territoryCode: "DE",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	el: {
		language: "Greek",
		territory: "Greece",
		territoryCode: "GR",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	en: {
		language: "English",
		territory: "United States",
		territoryCode: "US",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "MDY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "MM/dd/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	es: {
		language: "Spanish",
		territory: "Spain",
		territoryCode: "ES",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	et: {
		language: "Estonian",
		territory: "Estonia",
		territoryCode: "EE",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	eu: {
		language: "Basque",
		territory: "Spain",
		territoryCode: "ES",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	fa: {
		language: "Persian",
		territory: "Iran",
		territoryCode: "IR",
		numberFormat: {
			decimalSeparator: "٫",
			thousandsSeparator: "٬"
		},
		dateFormat: {
			order: "YMD",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy/MM/dd HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	fi: {
		language: "Finnish",
		territory: "Finland",
		territoryCode: "FI",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy H.mm"
		},
		timeFormat: {
			timeFormat: "H.mm"
		}
	},
	fil: {
		language: "Filipino",
		territory: "Philippines",
		territoryCode: "PH",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "MDY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "MM/dd/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	fo: {
		language: "Faroese",
		territory: "Faroe Islands",
		territoryCode: "FO",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	fr: {
		language: "French",
		territory: "France",
		territoryCode: "FR",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ga: {
		language: "Irish",
		territory: "Ireland",
		territoryCode: "IE",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	gl: {
		language: "Galician",
		territory: "Spain",
		territoryCode: "ES",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	gu: {
		language: "Gujarati",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd-MM-yyyy  hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	he: {
		language: "Hebrew",
		territory: "Israel",
		territoryCode: "IL",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	hi: {
		language: "Hindi",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	hr: {
		language: "Croatian",
		territory: "Croatia",
		territoryCode: "HR",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	hu: {
		language: "Hungarian",
		territory: "Hungary",
		territoryCode: "HU",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "YMD",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy.MM.dd HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	hy: {
		language: "Armenian",
		territory: "Armenia",
		territoryCode: "AM",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	id: {
		language: "Indonesian",
		territory: "Indonesia",
		territoryCode: "ID",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH.mm"
		},
		timeFormat: {
			timeFormat: "HH.mm"
		}
	},
	is: {
		language: "Icelandic",
		territory: "Iceland",
		territoryCode: "IS",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	it: {
		language: "Italian",
		territory: "Italy",
		territoryCode: "IT",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ja: {
		language: "Japanese",
		territory: "Japan",
		territoryCode: "JP",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy/MM/dd HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	ka: {
		language: "Georgian",
		territory: "Georgia",
		territoryCode: "GE",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	kk: {
		language: "Kazakh",
		territory: "Kazakhstan",
		territoryCode: "KZ",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	km: {
		language: "Khmer",
		territory: "Cambodia",
		territoryCode: "KH",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	kn: {
		language: "Kannada",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd  hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	ko: {
		language: "Korean",
		territory: "South Korea",
		territoryCode: "KR",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy.MM.dd a hh:mm"
		},
		timeFormat: {
			timeFormat: "a hh:mm"
		}
	},
	ky: {
		language: "Kyrgyz",
		territory: "Kyrgyzstan",
		territoryCode: "KG",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	lo: {
		language: "Lao",
		territory: "Laos",
		territoryCode: "LA",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	lt: {
		language: "Lithuanian",
		territory: "Lithuania",
		territoryCode: "LT",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	lv: {
		language: "Latvian",
		territory: "Latvia",
		territoryCode: "LV",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	mk: {
		language: "Macedonian",
		territory: "Macedonia",
		territoryCode: "MK",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ml: {
		language: "Malayalam",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	mn: {
		language: "Mongolian",
		territory: "Mongolia",
		territoryCode: "MN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	mr: {
		language: "Marathi",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	ms: {
		language: "Malay",
		territory: "Malaysia",
		territoryCode: "MY",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	my: {
		language: "Burmese",
		territory: "Myanmar (Burma)",
		territoryCode: "MM",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd-MM-yyyy B HH:mm"
		},
		timeFormat: {
			timeFormat: "B HH:mm"
		}
	},
	nb: {
		language: "Norwegian Bokmål",
		territory: "Norway",
		territoryCode: "NO",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ne: {
		language: "Nepali",
		territory: "Nepal",
		territoryCode: "NP",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	nl: {
		language: "Dutch",
		territory: "Netherlands",
		territoryCode: "NL",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd-MM-yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	pl: {
		language: "Polish",
		territory: "Poland",
		territoryCode: "PL",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	pt: {
		language: "Portuguese",
		territory: "Brazil",
		territoryCode: "BR",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ro: {
		language: "Romanian",
		territory: "Romania",
		territoryCode: "RO",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ru: {
		language: "Russian",
		territory: "Russia",
		territoryCode: "RU",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	si: {
		language: "Sinhala",
		territory: "Sri Lanka",
		territoryCode: "LK",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH.mm"
		},
		timeFormat: {
			timeFormat: "HH.mm"
		}
	},
	sk: {
		language: "Slovak",
		territory: "Slovakia",
		territoryCode: "SK",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "hh:mm"
		}
	},
	sl: {
		language: "Slovenian",
		territory: "Slovenia",
		territoryCode: "SI",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	sq: {
		language: "Albanian",
		territory: "Albania",
		territoryCode: "AL",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	sv: {
		language: "Swedish",
		territory: "Sweden",
		territoryCode: "SE",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	sw: {
		language: "Swahili",
		territory: "Tanzania",
		territoryCode: "TZ",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ta: {
		language: "Tamil",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy a hh:mm"
		},
		timeFormat: {
			timeFormat: "a hh:mm"
		}
	},
	te: {
		language: "Telugu",
		territory: "India",
		territoryCode: "IN",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd-MM-yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	th: {
		language: "Thai",
		territory: "Thailand",
		territoryCode: "TH",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	to: {
		language: "Tongan",
		territory: "Tonga",
		territoryCode: "TO",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	tr: {
		language: "Turkish",
		territory: "Turkey",
		territoryCode: "TR",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	uk: {
		language: "Ukrainian",
		territory: "Ukraine",
		territoryCode: "UA",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: " "
		},
		dateFormat: {
			order: "DMY",
			separator: ".",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd.MM.yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	ur: {
		language: "Urdu",
		territory: "Pakistan",
		territoryCode: "PK",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy hh:mm a"
		},
		timeFormat: {
			timeFormat: "hh:mm a"
		}
	},
	vi: {
		language: "Vietnamese",
		territory: "Vietnam",
		territoryCode: "VN",
		numberFormat: {
			decimalSeparator: ",",
			thousandsSeparator: "."
		},
		dateFormat: {
			order: "DMY",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "dd/MM/yyyy HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	},
	yue: {
		language: "Cantonese",
		territory: "Hong Kong SAR China",
		territoryCode: "HK",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "/",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy/MM/dd ah:mm"
		},
		timeFormat: {
			timeFormat: "ah:mm"
		}
	},
	zu: {
		language: "Zulu",
		territory: "South Africa",
		territoryCode: "ZA",
		numberFormat: {
			decimalSeparator: ".",
			thousandsSeparator: ","
		},
		dateFormat: {
			order: "YMD",
			separator: "-",
			zeroPadding: true
		},
		dateTimeFormat: {
			dateTimeFormat: "yyyy-MM-dd HH:mm"
		},
		timeFormat: {
			timeFormat: "HH:mm"
		}
	}
};

export interface DateFormat {
	readonly order: DateOrder;
	readonly separator: string;
	readonly zeroPadding: boolean;
}

export type DateOrder = "YMD" | "YDM" | "DMY" | "MDY";

export interface DateTimeFormat {
	readonly dateTimeFormat: string;
}

export interface TimeFormat {
	readonly timeFormat: string;
}

export interface NumberFormat {
	readonly decimalSeparator: string;
	readonly thousandsSeparator?: string;
	readonly decimalPlaces?: number;
}
