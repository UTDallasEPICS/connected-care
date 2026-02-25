<template>
	<DashboardButtonGrid :buttons="patientButtons" />
</template>

<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { onMounted } from "vue";
import { AccessPermission } from "~/types/permissions";
import { Calendar, User } from "lucide-vue-next";
import DashboardButtonGrid from "~/components/DashboardButtonGrid.vue";

const access = useCookie("AccessPermission");
const userId = useCookie("userId");

onMounted(() => {
	if (!access.value?.[AccessPermission.PATIENT]) {
		navigateTo("/dashboard");
	}
});

const patientButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "SCHEDULE",
	},
	{
		path: { name: "myProfile-id", params: { id: userId.value } },
		icon: User,
		label: "VIEW PROFILE",
	},
];
</script>
