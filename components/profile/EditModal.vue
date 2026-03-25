<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
		aria-modal="true"
		role="dialog"
	>
		<!-- Dimmed Background -->
		<div
			class="absolute inset-0 bg-black/70"
			@click.self="$emit('update:modelValue', false)"
		></div>

		<!-- Modal Content -->
		<div
			class="max-w-7/12 relative z-10 w-full overflow-y-auto bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Edit Profile</h2>
			<form @submit.prevent="$emit('save', formData)">
				<template
					v-for="section in formBlueprint.slice(0, 3)"
					:key="section.sectionTitle"
				>
					<h3 class="mb-2 font-semibold">
						{{ section.sectionTitle }}
					</h3>
					<div v-for="(row, rowIdx) in section.fields" :key="rowIdx">
						<FormDynamicInput
							v-for="field in row"
							:key="field.name"
							v-model="formData[field.name]"
							:field-config="field"
						/>
					</div>
				</template>

				<!-- Action Buttons -->
				<div class="flex justify-end space-x-2">
					<button
						type="button"
						class="bg-blay px-2 hover:cursor-pointer"
						@click="$emit('update:modelValue', false)"
					>
						Cancel
					</button>
					<button type="submit" class="btn hover:cursor-pointer">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { formBlueprint } from "~/types/FormConfig/index";
import type { FormFieldValue } from "~/types/FormConfig/formConfig";
import type { Profile } from "~/types/formTypes";

const props = defineProps<{
	modelValue: boolean;
	profile: Profile;
}>();

defineEmits<{
	"update:modelValue": [value: boolean];
	save: [data: Record<string, FormFieldValue>];
}>();

const formData = ref<Record<string, FormFieldValue>>({});

watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal && props.profile) {
			formData.value.firstName = props.profile.firstName || "";
			formData.value.middleName = props.profile.middleInitial || "";
			formData.value.lastName = props.profile.lastName || "";
			formData.value.email = props.profile.email || "";
			formData.value.phone = props.profile.phone || "";
			formData.value.whatsapp = props.profile.whatsApp || "";

			if (props.profile.NonEmployee?.dob) {
				formData.value.DOB =
					props.profile.NonEmployee.dob.split("T")[0];
			}
			if (props.profile.NonEmployee?.gender) {
				formData.value.gender = props.profile.NonEmployee.gender;
			}
			if (props.profile.NonEmployee) {
				const ne = props.profile.NonEmployee;
				formData.value.address =
					`${ne.streetNum || ""} ${ne.streetName || ""}`.trim();
			}
			if (props.profile.NonEmployee?.postCode) {
				formData.value.postcode = props.profile.NonEmployee.postCode;
			}
			if (props.profile.NonEmployee?.PostCodeCity?.city) {
				formData.value.city =
					props.profile.NonEmployee.PostCodeCity.city;
			}
		}
	}
);
</script>
