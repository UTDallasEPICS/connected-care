<template>
	<PatientTherapySection
		ref="therapySectionRef"
		:patient-id="patientId"
	/>

	<PatientProfileSection
		ref="profileSectionRef"
		:patient-id="patientId"
		:profile="profile"
		@profile-updated="emit('profile-updated')"
	/>
</template>

<script setup lang="ts">
import PatientTherapySection from "~/components/patient/TherapySection.vue";
import PatientProfileSection from "~/components/patient/ProfileSection.vue";

const props = defineProps<{
	patientId: string;
	profile: Record<string, unknown>;
}>();

const emit = defineEmits<{
	"profile-updated": [];
}>();

const therapySectionRef = ref<InstanceType<typeof PatientTherapySection> | null>(null);
const profileSectionRef = ref<InstanceType<typeof PatientProfileSection> | null>(null);

// --- Forward exposed methods so the parent pages don't need changes ---
function openRecommendationsModal() {
	therapySectionRef.value?.openRecommendationsModal();
}

function handleNewNote() {
	therapySectionRef.value?.handleNewNote();
}

function openEditModal() {
	profileSectionRef.value?.openEditModal();
}

defineExpose({ openRecommendationsModal, handleNewNote, openEditModal });
</script>
