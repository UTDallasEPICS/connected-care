<template>
	<DashboardButtonGrid :buttons="therapistButtons" />
</template>
<script lang="ts" setup>
import { Calendar, Users, FileText } from "lucide-vue-next";

useDashboardGuard("THERAPIST");

const therapistButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "VIEW SCHEDULE",
	},
	{
		path: "/patientSearch",
		icon: Users,
		label: "VIEW PATIENTS",
	},
	{
		path: "/viewContactForms",
		icon: FileText,
		label: "VIEW NEW CONTACT FORMS",
	},
];
</script>
