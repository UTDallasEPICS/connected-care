<template>
	<section class="mb-6 rounded border p-4">
		<h2 class="mb-2 text-xl font-semibold">Profile Details</h2>

		<p v-for="field in profileFields" :key="field.label" class="mb-2">
			<strong>{{ field.label }}:</strong>
			{{ field.value || "—" }}
		</p>

		<!-- Contact + address block for non-therapists -->
		<template v-if="!can('THERAPIST')">
			<p v-for="c in contactFields" :key="c.label" class="mb-2">
				<strong>{{ c.label }}:</strong> {{ c.value || "—" }}
			</p>
			<div class="mb-2 mt-8">
				<strong>Address:</strong>
				<div class="pl-12">
					<div>
						{{ nonEmployee?.streetNum }}
						{{ nonEmployee?.streetName }}
						<template v-if="nonEmployee?.buildingNum"
							>, {{ nonEmployee.buildingNum }}</template
						>
					</div>
					<div>
						{{ postCodeCity?.city }},
						{{ nonEmployee?.postCode }}
					</div>
				</div>
			</div>
		</template>

		<p class="mb-2 mt-8">
			<strong>Diagnosed?</strong>
			{{ patient?.diagnosed }}
		</p>
		<p v-if="!can('THERAPIST')" class="mb-2">
			<strong>All Sessions Paid?</strong>
			{{ paid }}
		</p>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	profile: Record<string, unknown>;
	nonEmployee: Record<string, unknown>;
	patient: Record<string, unknown>;
	paid: boolean;
}>();

const { can } = useAccess();

const postCodeCity = computed(
	() => (props.nonEmployee?.PostCodeCity as Record<string, unknown>) ?? {}
);

const profileFields = computed(() => [
	{
		label: "Full name",
		value: [
			props.profile.firstName,
			props.profile.middleInitial,
			props.profile.lastName,
		]
			.filter(Boolean)
			.join(" "),
	},
	{
		label: "Date of birth",
		value: props.nonEmployee?.dob
			? new Date(props.nonEmployee.dob as string).toDateString()
			: null,
	},
	{ label: "Diagnosis", value: props.patient?.diagnosis },
	{ label: "Record number", value: props.patient?.recordNumber },
	{ label: "Sex", value: props.nonEmployee?.gender },
	{ label: "Medication", value: props.patient?.medication },
	{ label: "Allergies", value: props.patient?.allergies },
	{ label: "Diet", value: props.patient?.diet },
	{ label: "Parent/Guardian", value: props.patient?.parentName },
]);

const contactFields = computed(() => [
	{ label: "Email", value: props.profile.email },
	{ label: "Phone", value: props.profile.phone },
	{ label: "WhatsApp", value: props.profile.whatsApp },
	{ label: "Contact Preference", value: props.profile.contactPreference },
]);
</script>
