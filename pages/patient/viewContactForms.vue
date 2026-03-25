<template>
	<div class="font-sc-encode m-5 flex justify-center">
		<div class="flex flex-col gap-10">
			<div
				class="md:w-200 flex w-4/5 flex-col justify-between md:flex-row"
			>
				<div class="font-cormorant-garamond">
					<h1 class="text-2xl">View Incoming Contact Forms</h1>
				</div>
				<div class="flex w-full flex-row md:w-1/3">
					<ViewContactFormSortControl
						v-model="sortBy"
						:options="sortOptions"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-5">
				<ViewContactFormTable
					:columns="columns"
					:patients="processingPatients"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { $fetch } from "ofetch";

interface Patient {
	fName: string;
	lName: string;
	NonEmployee?: {
		Patient?: {
			identification?: string;
			ContactForm?: {
				insurance?: string;
				comment?: string;
			};
		};
	};
}

const columns = [
	{ key: "fName", label: "First Name" },
	{ key: "lName", label: "Last Name" },
	{ key: "identification", label: "SSN" },
	{ key: "insurance", label: "Insurance" },
	{ key: "comments", label: "Comments" },
];

const sortOptions = ["SSN", "Last Name"];
const sortBy = ref("");
const processingPatients = ref<Patient[]>([]);

async function getPatients() {
	try {
		const response = await $fetch<Patient[]>("/api/contactForm/viewForm", {
			method: "GET",
			params: { term: "PROCESSING" },
		});

		processingPatients.value = response;

		if (!response) {
			throw new Error("Could not submit form");
		}
	} catch {
		console.log("Could not submit form");
	}
}

function sort(category: string) {
	if (category === "Last Name")
		processingPatients.value = [...processingPatients.value].sort((a, b) =>
			a.lName.localeCompare(b.lName)
		);
	else if (category === "SSN")
		processingPatients.value = [...processingPatients.value].sort((a, b) =>
			(a.NonEmployee?.Patient?.identification ?? "").localeCompare(
				b.NonEmployee?.Patient?.identification ?? ""
			)
		);
}

watch(sortBy, (newSortBy) => {
	sort(newSortBy);
});

onMounted(() => {
	getPatients();
});
</script>
