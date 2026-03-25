<template>
	<DashboardButtonGrid :buttons="userServiceButtons" />
</template>

<script lang="ts" setup>
import { Calendar, Users, FileText } from "lucide-vue-next";

useDashboardGuard("USER_SERVICE");

const userServiceButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "SCHEDULE",
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
