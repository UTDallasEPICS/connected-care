<template>
	<table
		class="font-cormorant-garamond w-full border-collapse border-2 border-b-black text-2xl"
	>
		<thead>
			<tr class="border-collapse border-2 border-b-black">
				<th
					v-for="col in columns"
					:key="col.key"
					class="border-collapse border-2 border-b-black px-2"
				>
					{{ col.label }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(patient, index) in patients"
				:key="index"
				class="font-sc-encode border-collapse border-2 border-b-black text-lg"
			>
				<td class="border-collapse border-2 border-b-black px-2">
					{{ patient.fName }}
				</td>
				<td class="border-collapse border-2 border-b-black px-2">
					{{ patient.lName }}
				</td>
				<td class="border-collapse border-2 border-b-black px-2">
					{{ patient.NonEmployee?.Patient?.identification }}
				</td>
				<td class="border-collapse border-2 border-b-black px-2">
					{{ patient.NonEmployee?.Patient?.ContactForm?.insurance }}
				</td>
				<td class="border-collapse border-2 border-b-black px-2">
					{{
						patient.NonEmployee?.Patient?.ContactForm?.comment == ""
							? "None"
							: patient.NonEmployee?.Patient?.ContactForm?.comment
					}}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
interface ContactForm {
	insurance?: string;
	comment?: string;
}

interface Patient {
	fName: string;
	lName: string;
	NonEmployee?: {
		Patient?: {
			identification?: string;
			ContactForm?: ContactForm;
		};
	};
}

defineProps<{
	columns: { key: string; label: string }[];
	patients: Patient[];
}>();
</script>
