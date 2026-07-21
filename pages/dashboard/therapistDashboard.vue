<template>
	<DashboardButtonGrid :buttons="therapistButtons" />
</template>
<script lang="ts" setup>
import { Calendar, Users } from "lucide-vue-next";
import { useDashboardGuard } from "~/composables/auth/useDashboardGuard";

useDashboardGuard("THERAPIST");

const therapistButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "VIEW SCHEDULE",
	},
	{
		path: { name: "patient-patientSearch" },
		icon: Users,
		label: "VIEW PATIENTS",
	},
];
</script>
