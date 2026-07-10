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

import { initializeKeys } from "@com.mgmtp.a12.utils/utils-localization";

/**
 * This tree contains all keys of static resources that are used by the form-engine.
 *
 * Please note that adding new keys to this object is not considered as a breaking change.
 *
 * These keys can be customized in different ways. By choosing one of the
 * following options, you can decide if you want to enforce compile errors for
 * missing keys or not:
 *
 * To ensure, that all keys are defined, you can define a new object via typeof:
 * ```typescript
 * const en_US: typeof RESOURCE_KEYS = {...}
 * ```
 * A missing key will result in a compile error in this case.
 *
 * To provide a partial resource bundle, which does not enforce the definition of
 * all keys, you can either:
 *
 * * Define a new object of type LocalizationTreeMap:
 * ```typescript
 * const RESOURCES: LocalizationTreeMap = {...}
 * ```
 *
 * * Define a new object via typeof, while using a recursive Partial<...>:
 * ```typescript
 * type DeepPartial<T> = T extends object ? {
 *     [P in keyof T]?: DeepPartial<T[P]>;
 * } : T;
 * const en_US: DeepPartial<typeof RESOURCE_KEYS> = {...}
 * ```
 */
export const RESOURCE_KEYS = {
	/** Key of the text used for boolean value true */
	true: "",
	/** Key of the text used for boolean value false */
	false: "",
	/** Key of the text used for value null */
	null: "",
	autocomplete: {
		/**
		 * Key of the template that is used for the autocomplete widget.
		 *
		 * Available "placeholder":
		 * * `{count}` - number of matching entries
		 * * `{total}` - number of all entries
		 */
		hintTemplate: ""
	},
	repeat: {
		buttonLabels: {
			/** Key of the 'add' button of a repeat */
			ADD: "",
			/** Key of the 'commit' button, that is shown on the detached repeat detail screen for new rows */
			COMMIT_ADD: "",
			/** Key of the 'apply' button, that is shown on the detached repeat detail screen when editing existing rows */
			APPLY: "",
			/** Key of the 'edit' row action button */
			EDIT: "",
			/** Key of the 'remove' row action button */
			REMOVE: "",
			/** Key of the 'view' row action button */
			VIEW: "",
			/** Key of the 'cancel' button, that is shown in confirmation dialogs and on detached repeat detail screens */
			CANCEL: "",
			/** Key of the 'confirm' button in a detached repeat detail screen */
			CONFIRM: "",
			/** Key of the 'return' button in a detached repeat detail screen */
			RETURN: "",
			/** Key of the 'up' row action button */
			UP: "",
			/** Key of the 'down' row action button */
			DOWN: "",
			/** Key of the 'copy' row action button */
			COPY: "",
			/** Key of the 'close' button in an expanded embedded repeat row */
			CLOSE: "",
			/** Key of the 'download' row action button */
			DOWNLOAD: "",
			/** Key of the 'skip' button in the duplicate file name dialog of a multi file upload repeat */
			SKIP: "",
			/** Key of the 'replace' button in the duplicate file name dialog of a multi file upload repeat */
			REPLACE: "",
			/** Key of the 'upload as copy' button in the duplicate file name dialog of a multi file upload repeat */
			UPLOAD_AS_COPY: ""
		},
		/** Key of the title for the deletion confirmation dialog */
		deletionConfirmationTitle: "",
		/** Key of the text for the deletion confirmation dialog */
		deletionConfirmationText: "",
		empty: {
			/** Key of the repeat hint if no entries exist */
			entries: "",
			/** Key of the repeat hint if no entries are visible due to filter settings */
			filtered: ""
		},
		hidden: {
			/** Key of the repeat hint if the last created row is not visible due to filter settings */
			newEntry: ""
		},
		filter: {
			/** Key of the empty filter label */
			empty: "",
			string: {
				/** Key of the string filter label */
				title: ""
			},
			number: {
				/** Key of the "from" number filter label */
				from: "",
				/** Key of the "to" number filter label */
				to: ""
			},
			date: {
				/** Key of the "from" date filter label */
				from: "",
				/** Key of the "to" date filter label */
				to: ""
			},
			dateTime: {
				/** Key of the "from" date-time filter label */
				from: "",
				/** Key of the "to" date-time filter label */
				to: ""
			},
			time: {
				/** Key of the "from" time filter label */
				from: "",
				/** Key of the "to" time filter label */
				to: ""
			},
			dateRange: {
				/** Key of the date-range filter label */
				title: ""
			},
			boolean: {
				/** Key of the boolean filter label */
				title: ""
			},
			confirm: {
				/** Key of the confirm filter label */
				title: ""
			},
			enumeration: {
				/** Key of the enumeration filter label */
				title: ""
			},
			button: {
				title: {
					/** Key of the "open" title of the filter button */
					open: "",
					/** Key of the "close" title of the filter button */
					close: ""
				}
			},
			/**Key of the clear filter button */
			clear: ""
		},
		detachedRepeat: {
			button: {
				cancel: {
					confirmation: {
						/** Key of the title of the confirmation dialog after clicking cancel on detached repeat detail screen */
						title: "",
						/** Key of the text of the confirmation dialog after clicking cancel on detached repeat detail screen */
						text: "",
						button: {
							/** Key of the discard button of the confirmation dialog after clicking cancel on detached repeat detail screen */
							discard: "",
							/** Key of the abort button of the confirmation dialog after clicking cancel on detached repeat detail screen */
							abort: ""
						}
					}
				}
			}
		},
		embeddedRepeat: {
			/** Key of the "error" hint for an embedded-repeat row which contains validation errors */
			errorHint: ""
		},
		multiFileUpload: {
			dialog: {
				duplicate: {
					/** Key of the title of the duplicate file name dialog if only one duplicate was found */
					title: "",
					/**
					 * Key of the text of the duplicate file name dialog if only one duplicate was found
					 *
					 * Available "placeholder":
					 * * `$FILE_NAME$` - the duplicate file name
					 */
					text: ""
				},
				multipleDuplicates: {
					/** Key of the title of the duplicate file name dialog if multiple duplicates were found
					 *
					 * Available "placeholder":
					 * * `$DUPLICATE_COUNT$` - the number of duplicates
					 */
					title: "",
					/** Key of the text of the duplicate file name dialog if multiple duplicates were found
					 *
					 * Available "placeholder":
					 * * `$DUPLICATE_COUNT$` - the number of duplicates
					 */
					text: ""
				},
				tooManyFiles: {
					/** Key of the title of the dialog, that is shown if too many files were selected */
					title: "",
					/**
					 * Key of the text of the dialog, that is shown if too many files were selected
					 *
					 * Available "placeholder":
					 * * `$FILE_COUNT$` - the number of selected files
					 * * `$AVAILABLE_SPACE$` - the available space in the repeatable group
					 */
					text: ""
				}
			},
			error: {
				/** Key of the text of the error message, that is shown after an upload error */
				text: ""
			}
		}
	},
	validation: {
		/** Key of the text for an error */
		error: "",
		/** Key of the text for a warning */
		warning: "",
		/** Key of the text for an information */
		info: "",
		/** Key of the validate button in correction mode */
		validate: "",
		/**
		 * Key of the text that is used for the validation bar if only errors exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$WARNING_COUNT$` - number of warnings
		 * * `$INFO_COUNT$` - number of infos
		 */
		errors: "",
		/**
		 * Key of the text that is used for the validation bar if only warnings exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$WARNING_COUNT$` - number of warnings
		 * * `$INFO_COUNT$` - number of infos
		 */
		warnings: "",
		/**
		 * Key of the text that is used for the validation bar if only infos exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$WARNING_COUNT$` - number of warnings
		 * * `$INFO_COUNT$` - number of infos
		 */
		infos: "",
		/**
		 * Key of the text that is used for the validation bar if errors and warnings exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$WARNING_COUNT$` - number of warnings
		 */
		errorsandwarnings: "",
		/**
		 * Key of the text that is used for the validation bar if errors and infos exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$INFO_COUNT$` - number of infos
		 */
		errorsandinfos: "",
		/**
		 * Key of the text that is used for the validation bar if warnings and infos exists.
		 *
		 * Available "placeholder":
		 * * `$WARNINGS_COUNT$` - number of warnings
		 * * `$INFO_COUNT$` - number of infos
		 */
		warningsandinfos: "",
		/**
		 * Key of the text that is used for the validation bar if errors, warnings and infos exists.
		 *
		 * Available "placeholder":
		 * * `$ERROR_COUNT$` - number of errors
		 * * `$WARNING_COUNT$` - number of warnings
		 * * `$INFO_COUNT$` - number of infos
		 */
		errorsandwarningsandinfos: "",
		correctionMode: {
			/** Key of the title of the correction screen */
			title: "",
			/** Key of the text that is used if all error are solved in correction mode */
			noErrors: "",
			/** Key of the exit button of the correction mode */
			exit: "",
			/** Key of the button of the correction screen for hiding the details of an issue */
			hideMessageBoxDetails: "",
			/** Key of the button of the correction screen for showing the details of an issue */
			showMessageBoxDetails: ""
		},
		correctionScreen: {
			/** Key of the back button of the correction screen */
			back: ""
		},
		confirmation: {
			/** Key of the confirmation dialog title */
			title: "",
			/** Key of the confirmation dialog description */
			description: "",
			/**
			 * Key that is used for the confirmation dialog text about the number of warnings.
			 */
			warnings: "",
			/**
			 * Key that is used for the confirmation dialog text about the number of infos.
			 */
			infos: "",
			/** Key of the cancel button of the confirmation dialog */
			cancel: "",
			/** Key of the confirm button of the confirmation dialog */
			confirm: ""
		},
		/** Key of the "go to issue" button in the validation bar */
		goToIssue: "",
		/** Key of the "collapse" button in the validation bar */
		collapseMessage: "",
		/** Key of the "expand" button in the validation bar */
		expandMessage: "",
		/** Key of the button in the validation bar that brings the user to the correction screen */
		showAllIssues: "",
		mobile: {
			/** Key of the previous button in the correction mode in mobile mode */
			previous: "",
			/** Key of the next button in the correction mode in mobile mode */
			next: "",
			/** Key of the "show all" button in the correction mode in mobile mode */
			showAll: ""
		},
		/** Key of the text that is shown in the validation bar if multiple possibilities exist to solve the issue */
		multiplePossibleCauses: "",
		/** Key of the text that is shown if it is not possible to fix the error in the current form */
		issueCannotBeFixed: "",
		/** Key of the text that is shown if there are no links but it is possible to fix the error in the current form */
		issueCanBeFixed: ""
	},
	date: {
		button: {
			/** Key of the button to open the date picker */
			open: "",
			/** Key of the ok button in the date picker */
			ok: ""
		}
	},
	datetime: {
		button: {
			/** Key of the button to open the date-time picker */
			open: "",
			/** Key of the back button in the date-time picker */
			back: "",
			/** Key of the ok button in the date-time picker */
			ok: "",
			/** Key of the clear button in the date-time picker */
			clear: "",
			/** Key of the edit-time button in the date-time picker */
			editTime: ""
		},
		/**
		 * Key of the placeholder text in the date picker
		 * which is used when no time is selected
		 */
		placeholderTime: ""
	},
	time: {
		button: {
			/** Key of the button to open the time picker */
			open: "",
			/** Key of the ok button in the time picker */
			ok: "",
			/** Key of the clear button in the date-time picker */
			clear: ""
		},
		/**
		 * Key of the placeholder text in the date picker
		 * which is used when no time is selected
		 */
		placeholderTime: ""
	},
	daterange: {
		button: {
			/** Key of the button to open the date range picker */
			open: "",
			/** Key of the ok button in the date range picker */
			ok: "",
			/** Key of the clear button in the date range picker */
			clear: ""
		}
	},
	attachment: {
		button: {
			/** Key of the replace button in the pop-up menu of an attachment */
			replace: "",
			/** Key of the download button in the pop-up menu of an attachment */
			download: "",
			/** Key for the title of the disabled download button in the pop-up menu of an attachment */
			downloadDisabled: "",
			/** Key of the remove button in the pop-up menu of an attachment */
			remove: ""
		},
		dialog: {
			abort: {
				/** Key of the title of the confirmation dialog for cancelling an action */
				title: "",
				/** Key of the content text of the confirmation dialog for cancelling an action */
				content: "",
				button: {
					/** Key of the continue button of the confirmation dialog for cancelling an action */
					continue: "",
					/** Key of the cancel button of the confirmation dialog for cancelling an action */
					cancel: ""
				}
			},
			remove: {
				/** Key of the title button of the confirmation dialog for removing an attachment */
				title: "",
				/** Key of the content text button of the confirmation dialog for removing an attachment */
				content: "",
				button: {
					/** Key of the continue button of the confirmation dialog for removing an attachment */
					continue: "",
					/** Key of the cancel button of the confirmation dialog for removing an attachment */
					cancel: ""
				}
			}
		},
		title: {
			/**
			 * Key for the title of an attachment after a file has been uploaded,
			 * when the current action is 'replace'.
			 *
			 * Available Placeholder: `$FILE_NAME$`: The name of the uploaded file
			 */
			replace: "",
			/**
			 * Key for the title of an attachment after a file has been uploaded,
			 * when the current action is 'download'.
			 *
			 * Available Placeholder: `$FILE_NAME$`: The name of the uploaded file
			 */
			download: ""
		},
		/**
		 * Localization keys of common attachment errors.
		 */
		error: {
			/** Key of an unknown error, $ERROR$ is available as a placeholder containing the stringified error object */
			unknown: ""
		}
	},
	multiselect: {
		/**
		 * Key of the template that is used for the multi-select widget.
		 *
		 * Available "placeholder":
		 * * `{count}` - number of matching entries
		 * * `{total}` - number of all entries
		 */
		hintTemplate: "",
		/** Key of the 'Select all' checkbox in the multi-select */
		selectAllText: "",
		/** Key of the mobile heading text in the multi-select */
		mobileHeadingText: "",
		/** Key of the hint text for the 'and' filter option */
		filterAnd: "",
		/** Key of the hint text for the 'or' filter option */
		filterOr: ""
	},
	textOutput: {
		/** Key of the 'no data' text which is shown when no data is available for a TextOutput */
		noData: ""
	}
};

initializeKeys(RESOURCE_KEYS);
