<template>
	<div class="font-karla">
		<div class="flex h-auto place-content-center overflow-y-auto">
			<div class="flex-col flex-wrap font-light md:w-180">
				<h1 class="mt-5 ml-5 text-4xl sm:mr-5 sm:ml-0">
					Patient Contact Form
				</h1>
				<div class="justify-start p-5 text-lg">
					<form
						class="flex w-full flex-col flex-wrap bg-white"
						@submit.prevent="handleSubmit"
					>
						<div
							v-for="section in userFormBlueprint"
							:key="section.sectionTitle"
						>
							<h2 class="mt-5 mb-3 text-2xl font-semibold">
								{{ section.sectionTitle }}
							</h2>
							<div class="flex w-full flex-wrap gap-5 py-5">
								<div
									v-for="(row, rowIdx) in section.fields"
									:key="rowIdx"
									class="flex w-full gap-5"
								>
									<FormDynamicInput
										v-for="field in row"
										:key="field.name"
										v-model="formData[field.name]"
										:field-config="field"
									/>
								</div>
							</div>
						</div>
						<button class="btn mt-5 flex flex-col">
							Submit form
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { userFormBlueprint } from "~/types/FormConfig";
import type { FormFieldValue } from "~/types/FormConfig/formConfig";
import { ref } from "vue";

const formData = ref<Record<string, FormFieldValue>>({});

async function handleSubmit() {
	try {
		const response = await $fetch("/api/contactForm/form", {
			method: "POST",
			body: formData.value,
		});

		console.log(response);

		if (response == null || !response) {
			throw new Error("Could not submit form");
		}

		formData.value = {};
	} catch (e) {
		console.log(e);
		alert("Form submit encountered an error, check console");
	}
}
</script>
