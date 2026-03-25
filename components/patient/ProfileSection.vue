<template>
	<ProfileEditModal
		v-model="modals.edit"
		:profile="profile"
		@save="handleEditProfileSave"
	/>
</template>

<script setup lang="ts">
const props = defineProps<{
	patientId: string;
	profile: Record<string, unknown>;
}>();

const emit = defineEmits<{
	"profile-updated": [];
}>();

const { saveProfile } = useProfileSave(
	props.patientId,
	computed(() => props.profile),
	async () => {
		emit("profile-updated");
	}
);
const { modals, openModal, closeModal } = useModalToggle("edit");

// --- Exposed for parent to call ---
function openEditModal() {
	openModal("edit");
}

defineExpose({ openEditModal });

// --- Internal handlers ---
async function handleEditProfileSave(formData: Record<string, unknown>) {
	await saveProfile(formData);
	closeModal("edit");
}
</script>
