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
 * 1. Open-Source License – EUPL v1.2
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

import type { RESOURCE_KEYS } from "./keys.js";

/** @internal */
export const de: typeof RESOURCE_KEYS = {
	true: "ja",
	false: "nein",
	null: "",
	autocomplete: {
		hintTemplate: "{count} von {total} Optionen"
	},
	repeat: {
		buttonLabels: {
			ADD: "Hinzufügen",
			COMMIT_ADD: "Hinzufügen bestätigen",
			APPLY: "Anwenden",
			EDIT: "Bearbeiten",
			REMOVE: "Löschen",
			VIEW: "Öffnen",
			CANCEL: "Abbrechen",
			CONFIRM: "Bestätigen",
			RETURN: "Zurück",
			UP: "Nach oben",
			DOWN: "Nach unten",
			COPY: "Kopieren",
			CLOSE: "Schließen",
			DOWNLOAD: "Herunterladen",
			SKIP: "Überspringen",
			REPLACE: "Ersetzen",
			UPLOAD_AS_COPY: "Als Kopie hochladen"
		},
		deletionConfirmationTitle: "Zeile löschen",
		deletionConfirmationText:
			"Das Löschen der Zeile kann nicht rückgängig gemacht werden. Sind Sie sicher, dass Sie die Zeile löschen wollen?",
		empty: {
			entries: "Es gibt noch keine Einträge.",
			filtered: "Keine Ergebnisse gefunden"
		},
		hidden: {
			newEntry: "Der neue Eintrag erfüllt die Filteroptionen nicht."
		},
		filter: {
			empty: "Leer",
			string: {
				title: "Filter"
			},
			number: {
				from: "Filter Von",
				to: "Filter Bis"
			},
			date: {
				from: "Filter Von",
				to: "Filter Bis"
			},
			dateTime: {
				from: "Filter Von",
				to: "Filter Bis"
			},
			time: {
				from: "Filter Von",
				to: "Filter Bis"
			},
			dateRange: {
				title: "Filter"
			},
			boolean: {
				title: "Filter"
			},
			confirm: {
				title: "Filter"
			},
			enumeration: {
				title: "Filter"
			},
			button: {
				title: {
					open: "Filter öffnen",
					close: "Filter schließen"
				}
			},
			clear: "Filter löschen"
		},
		detachedRepeat: {
			button: {
				cancel: {
					confirmation: {
						title: "Ungespeicherte Änderungen!",
						text: "Wollen Sie die aktuelle Seite wirklich verlassen? Alle Änderungen gehen verloren.",
						button: {
							discard: "Änderungen verwerfen",
							abort: "Abbrechen"
						}
					}
				}
			}
		},
		embeddedRepeat: {
			errorHint: "Zeile enthält Validierungsfehler"
		},
		multiFileUpload: {
			dialog: {
				duplicate: {
					title: "Dateiname existiert bereits",
					text: 'Eine Datei mit dem Namen "$FILE_NAME$" existiert bereits. Wie möchten Sie fortfahren?'
				},
				multipleDuplicates: {
					title: "Dateiname existiert bereits ($DUPLICATE_COUNT$)",
					text: "Es existieren $DUPLICATE_COUNT$ Dateien, die denselben Namen haben wie eine Datei, die Sie gerade hochladen wollen. Wie möchten Sie fortfahren?"
				},
				tooManyFiles: {
					title: "Zu viele Dateien ausgewählt",
					text: "Sie haben $FILE_COUNT$ Dateien ausgewählt, aber es ist nur noch Platz für $AVAILABLE_SPACE$ weitere Datei(en) vorhanden."
				}
			},
			error: {
				text: "Die folgenden Dateien konnten nicht hochgeladen werden:"
			}
		}
	},
	validation: {
		error: "Fehler",
		warning: "Warnung",
		validate: "Validieren",
		info: "Information",
		errors: "Es gibt $ERROR_COUNT$ Validierungsfehler.",
		warnings: "Es gibt $WARNING_COUNT$ Validierungswarnungen.",
		infos: "Es gibt $INFO_COUNT$ Validierungsinformationen.",
		errorsandwarnings:
			"Es gibt $ERROR_COUNT$ Validierungsfehler und $WARNING_COUNT$ Validierungswarnungen.",
		errorsandinfos:
			"Es gibt $ERROR_COUNT$ Validierungsfehler und $INFO_COUNT$ Validierungsinformationen.",
		warningsandinfos:
			"Es gibt $WARNING_COUNT$ Validierungswarnungen und $INFO_COUNT$ Validierungsinformationen.",
		errorsandwarningsandinfos:
			"Es gibt $ERROR_COUNT$ Validierungsfehler, $WARNING_COUNT$ Validierungswarnungen und $INFO_COUNT$ Validierungsinformationen.",
		correctionMode: {
			title: "Korrekturmodus",
			noErrors: "Das Dokument hat keine Fehler.",
			exit: "Korrekturmodus verlassen",
			hideMessageBoxDetails: "Details verbergen",
			showMessageBoxDetails: "Details zeigen"
		},
		correctionScreen: {
			back: "Zurück"
		},
		confirmation: {
			title: "Bitte Validierungsergebnisse überprüfen",
			description: "Sie können mit der gewählten Aktion fortfahren oder die Ergebnisse überprüfen.",
			warnings: " Validierungswarnungen gefunden.",
			infos: " Validierungsinformationen gefunden.",
			cancel: "Überprüfen",
			confirm: "Weiter"
		},
		goToIssue: "Springe zum Problem",
		collapseMessage: "Nachricht einklappen",
		expandMessage: "Nachricht ausklappen",
		showAllIssues: "Alle Probleme zeigen",
		mobile: {
			previous: "Zurück",
			next: "Weiter",
			showAll: "Alle zeigen"
		},
		multiplePossibleCauses: "Mehrere mögliche Fehlerquellen",
		issueCannotBeFixed: "Dieses Problem kann im aktuellen Formular nicht korrigiert werden.",
		issueCanBeFixed:
			"Dieses Problem kann im aktuellen Formular korrigiert werden. Es können jedoch keine Verweise zu möglichen Fehlerquellen angegeben werden."
	},
	date: {
		button: {
			open: "Datum wählen",
			ok: "OK"
		}
	},
	datetime: {
		button: {
			open: "Datum und Uhrzeit wählen",
			back: "Zurück",
			ok: "OK",
			clear: "Löschen",
			editTime: "Zeit bearbeiten"
		},
		placeholderTime: "Bitte wählen"
	},
	time: {
		button: {
			open: "Uhrzeit wählen",
			ok: "OK",
			clear: "Löschen"
		},
		placeholderTime: "Bitte wählen"
	},
	daterange: {
		button: {
			open: "Datumsbereich wählen",
			ok: "OK",
			clear: "Löschen"
		}
	},
	attachment: {
		button: {
			replace: "Ersetzen",
			download: "Herunterladen",
			downloadDisabled: "Bitte speichern Sie die Änderungen am Anhang vor dem Herunterladen",
			remove: "Löschen"
		},
		dialog: {
			abort: {
				title: "Hochladen abbrechen",
				content: "Wollen Sie wirklich das aktuelle Hochladen abbrechen?",
				button: {
					continue: "Fortfahren",
					cancel: "Abbrechen"
				}
			},
			remove: {
				title: "Anhang löschen",
				content:
					"Das Löschen des aktuellen Anhangs kann nicht rückgängig gemacht werden. Sind Sie sicher, dass sie den Anhang löschen wollen?",
				button: {
					continue: "Löschen",
					cancel: "Abbrechen"
				}
			}
		},
		title: {
			replace: "Anhang $FILE_NAME$ austauschen",
			download: "Anhang $FILE_NAME$ herunterladen"
		},
		error: {
			unknown: "Ein unbekannter Fehler ist aufgetreten.$ERROR$"
		}
	},
	multiselect: {
		hintTemplate: "{count} von {total} Optionen",
		selectAllText: "Alle",
		mobileHeadingText: "Wählen Sie ihre Optionen",
		filterAnd: "Und",
		filterOr: "Oder"
	},
	textOutput: {
		noData: "keine Daten"
	}
};
