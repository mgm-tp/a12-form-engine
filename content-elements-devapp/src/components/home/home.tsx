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

import { useDispatch, useSelector } from "react-redux";

import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { ContentEditorDataHolder } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.view.js";
import { Typography } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/main/typography.view.js";

const { Grid, Row, Column } = LayoutGrid;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Home(props: ViewNGProps): React.JSX.Element {
	const dispatch = useDispatch();
	const activity = useSelector(ActivitySelectors.latestActivity());

	if (activity) {
		return (
			<ActionContentbox
				headingElements={<Typography.Headline level={1}>Examples</Typography.Headline>}
			>
				<Typography.Headline level={2}>Content Engine</Typography.Headline>
				<Grid>
					<Row>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="fieldTypes"
								block={true}
								label={"Field Types"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "fieldTypes-cm",
												model: "fieldTypes-dm",
												instance: "fieldTypes-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="table"
								block={true}
								label={"Table"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "table-cm",
												model: "table-dm",
												instance: "table-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="dependencies"
								block={true}
								label={"Dependencies"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "dependency-cm",
												model: "dependency-dm",
												instance: "dependency-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
					</Row>
					<Row>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="validation"
								block={true}
								label={"Validation"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "validation-cm",
												model: "validation-dm",
												instance: "validation-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="messageGroup"
								block={true}
								label={"Message Group"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "messageGroup-cm",
												model: "messageGroup-dm",
												instance: "messageGroup-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="errorTypes"
								block={true}
								label={"Error Types"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												contentModelName: "errorTypes-cm",
												model: "errorTypes-dm",
												instance: "errorTypes-dm/1"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
					</Row>
				</Grid>
				<Typography.Headline level={2}>Content Editor</Typography.Headline>
				<Grid>
					<Row>
						<Column size={{ sm: 2, md: 2, lg: 2 }}>
							<Button
								key="editor"
								block={true}
								label={"Editor"}
								onClick={() => {
									dispatch(ActivityActions.cancel({ activityId: activity.id }));
									dispatch(
										ActivityActions.create({
											activityDescriptor: {
												...ContentEditorDataHolder.Descriptor.create(),
												contentModelName: "editor-cm"
											},
											loadingState: "missing"
										})
									);
								}}
							/>
						</Column>
					</Row>
				</Grid>
			</ActionContentbox>
		);
	} else {
		return <div>Nothing to show here.</div>;
	}
}
