import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";

declare const Anything: any;

const removed = (
	<>
		<FormEngineViews.FormEngine
			activityId={"42"}
			name={Anything}
			modelDescriptors={Anything}
			configuration={Anything}
			constraints={Anything}
			ProgressComponent={Anything}
			models={Anything}
			uiState={Anything}
		>
			{Anything}
		</FormEngineViews.FormEngine>

		<FormEngineViews.FormEngineTpl
			activityId={"42"}
			name={Anything}
			modelDescriptors={Anything}
			configuration={Anything}
			constraints={Anything}
			ProgressComponent={Anything}
			models={Anything}
			uiState={Anything}
		>
			{Anything}
		</FormEngineViews.FormEngineTpl>

		<FormEngineViews.ScrollHandler
			activityId={"42"}
			name={Anything}
			modelDescriptors={Anything}
			configuration={Anything}
			constraints={Anything}
			ariaLevel={Anything}
			ProgressComponent={Anything}
			cardView
		>
			{Anything}
		</FormEngineViews.ScrollHandler>
	</>
);
