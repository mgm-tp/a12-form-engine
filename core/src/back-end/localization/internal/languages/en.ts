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
export const en: typeof RESOURCE_KEYS = {
	true: "yes",
	false: "no",
	null: "",
	autocomplete: {
		hintTemplate: "{count} out of {total} options"
	},
	repeat: {
		buttonLabels: {
			ADD: "Add",
			COMMIT_ADD: "Commit",
			APPLY: "Apply",
			EDIT: "Edit",
			REMOVE: "Delete",
			VIEW: "Open",
			CANCEL: "Cancel",
			CONFIRM: "Confirm",
			RETURN: "Return",
			UP: "Up",
			DOWN: "Down",
			COPY: "Copy",
			CLOSE: "Close",
			DOWNLOAD: "Download",
			SKIP: "Skip",
			REPLACE: "Replace",
			UPLOAD_AS_COPY: "Upload as copy"
		},
		deletionConfirmationTitle: "Delete Row",
		deletionConfirmationText:
			"Deleting this Row cannot be reverted. Are you sure you want to delete it?",
		empty: {
			entries: "There are no entries yet.",
			filtered: "No results found"
		},
		hidden: {
			newEntry: "New entry doesn't match with filter options."
		},
		filter: {
			empty: "Empty",
			string: {
				title: "Filter"
			},
			number: {
				from: "Filter From",
				to: "Filter To"
			},
			date: {
				from: "Filter From",
				to: "Filter To"
			},
			dateTime: {
				from: "Filter From",
				to: "Filter To"
			},
			time: {
				from: "Filter From",
				to: "Filter To"
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
					open: "Open filter",
					close: "Close filter"
				}
			},
			clear: "Clear filter"
		},
		detachedRepeat: {
			button: {
				cancel: {
					confirmation: {
						title: "Unsaved changes!",
						text: "Do you really want to leave the current screen? All changes will be lost.",
						button: {
							discard: "Discard changes",
							abort: "Cancel"
						}
					}
				}
			}
		},
		embeddedRepeat: {
			errorHint: "Row contains validation errors"
		},
		multiFileUpload: {
			dialog: {
				duplicate: {
					title: "File name already exists",
					text: 'A file with name "$FILE_NAME$" already exists. How do you want to proceed?'
				},
				multipleDuplicates: {
					title: "File name already exists ($DUPLICATE_COUNT$)",
					text: "There are $DUPLICATE_COUNT$ files, which have the same name as a file, you want to upload. How do you want to proceed?"
				},
				tooManyFiles: {
					title: "Too many files selected",
					text: "You selected $FILE_COUNT$ files, but there is only space for $AVAILABLE_SPACE$ more file(s)."
				}
			},
			error: {
				text: "The following files could not be uploaded:"
			}
		}
	},
	validation: {
		error: "Error",
		warning: "Warning",
		info: "Info",
		validate: "Validate",
		errors: "There are $ERROR_COUNT$ validation errors.",
		warnings: "There are $WARNING_COUNT$ validation warnings.",
		infos: "There are $INFO_COUNT$ validation infos.",
		errorsandwarnings:
			"There are $ERROR_COUNT$ validation errors and $WARNING_COUNT$ validation warnings.",
		errorsandinfos: "There are $ERROR_COUNT$ validation errors and $INFO_COUNT$ validation infos.",
		warningsandinfos:
			"There are $WARNING_COUNT$ validation warnings and $INFO_COUNT$ validation infos.",
		errorsandwarningsandinfos:
			"There are $ERROR_COUNT$ validation errors, $WARNING_COUNT$ validation warnings and $INFO_COUNT$ validation infos.",
		correctionMode: {
			title: "Correction Mode",
			noErrors: "The document has no errors.",
			exit: "Exit correction mode",
			hideMessageBoxDetails: "Hide details",
			showMessageBoxDetails: "Show details"
		},
		correctionScreen: {
			back: "Back"
		},
		confirmation: {
			title: "Please check validation results",
			description:
				"You can continue with your chosen action or go back to the form to check the issues.",
			warnings: " validation warnings were found.",
			infos: " validation informations were found.",
			cancel: "Check",
			confirm: "Continue"
		},
		goToIssue: "Go to Issue",
		collapseMessage: "Collapse Message",
		expandMessage: "Expand Message",
		showAllIssues: "Show All Issues",
		mobile: {
			previous: "Previous",
			next: "Next",
			showAll: "Show All"
		},
		multiplePossibleCauses: "Multiple possible causes",
		issueCannotBeFixed: "This issue cannot be fixed in the current form.",
		issueCanBeFixed:
			"The issue can be fixed in the current form. However, no links to the issue can be provided."
	},
	date: {
		button: {
			open: "Select date",
			ok: "OK"
		}
	},
	datetime: {
		button: {
			open: "Select date and time",
			back: "Back",
			ok: "OK",
			clear: "Clear",
			editTime: "Edit Time"
		},
		placeholderTime: "Please select"
	},
	time: {
		button: {
			open: "Select time",
			ok: "OK",
			clear: "Clear"
		},
		placeholderTime: "Please select"
	},
	daterange: {
		button: {
			open: "Select date range",
			ok: "OK",
			clear: "Clear"
		}
	},
	attachment: {
		button: {
			replace: "Replace",
			download: "Download",
			downloadDisabled: "Please save the changes to the attachment before downloading!",
			remove: "Delete"
		},
		dialog: {
			abort: {
				title: "Abort Upload",
				content: "Do you really want to abort the current upload?",
				button: {
					continue: "Continue",
					cancel: "Abort"
				}
			},
			remove: {
				title: "Delete Attachment",
				content:
					"Deleting the current Attachment cannot be reverted. Are you sure you want to delete it?",
				button: {
					continue: "Delete",
					cancel: "Cancel"
				}
			}
		},
		title: {
			replace: "Replace attachment $FILE_NAME$",
			download: "Download attachment $FILE_NAME$"
		},
		error: {
			unknown: "An unknown error occurred.$ERROR$"
		}
	},
	multiselect: {
		hintTemplate: "{count} out of {total} options",
		selectAllText: "All",
		mobileHeadingText: "Select your options",
		filterAnd: "And",
		filterOr: "Or"
	},
	textOutput: {
		noData: "no data"
	}
};
