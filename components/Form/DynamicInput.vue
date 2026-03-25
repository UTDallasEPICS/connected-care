<template>
	<div>
		<component
			:is="componentMap[fieldConfig.type]"
			v-model="model"
			:field-config="fieldConfig"
		/>
	</div>
</template>

<script setup lang="ts">
import type { ConcreteComponent } from "vue";
import type {
	FormFieldConfig,
	FormFieldValue,
} from "~/types/FormConfig/formConfig";

defineProps<{ fieldConfig: FormFieldConfig }>();
const model = defineModel<FormFieldValue>();

const componentMap: Record<string, ConcreteComponent> = {
	text: resolveComponent("FormInputText") as ConcreteComponent,
	number: resolveComponent("FormInputText") as ConcreteComponent,
	tel: resolveComponent("FormInputText") as ConcreteComponent,
	email: resolveComponent("FormInputText") as ConcreteComponent,
	date: resolveComponent("FormInputDate") as ConcreteComponent,
	multitext: resolveComponent("FormInputMultitext") as ConcreteComponent,
	select: resolveComponent("FormInputSelect") as ConcreteComponent,
	multiselect: resolveComponent("FormInputMultiselect") as ConcreteComponent,
	file: resolveComponent("FormInputFile") as ConcreteComponent,
	radio: resolveComponent("FormInputRadio") as ConcreteComponent,
	textarea: resolveComponent("FormInputTextarea") as ConcreteComponent,
	checkboxgroup: resolveComponent(
		"FormInputCheckboxGroup"
	) as ConcreteComponent,
	therapydrilldown: resolveComponent(
		"FormInputTherapyDrilldown"
	) as ConcreteComponent,
	objectivedetails: resolveComponent(
		"FormInputObjectiveDetails"
	) as ConcreteComponent,
	customgoals: resolveComponent("FormInputCustomGoals") as ConcreteComponent,
};
</script>
