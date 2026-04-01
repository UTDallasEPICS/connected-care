<template>
	<DashboardButtonGrid :buttons="patientButtons" />
</template>

<script lang="ts" setup>
import { Calendar, User } from "lucide-vue-next";

useDashboardGuard("PATIENT");
const { userId } = useAuthState();

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
