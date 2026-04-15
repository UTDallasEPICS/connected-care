<template>
	<DashboardButtonGrid :buttons="userServiceButtons" />
</template>

<script lang="ts" setup>
import { Calendar, Users, FileText, Plus, ClipboardCheck } from "lucide-vue-next";

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
	{
		path: "/viewAppointmentRequests",
		icon: Plus,
		label: "VIEW APPOINTMENT REQUESTS",
	},
	{
		path: "/assignNeuroSpecialist",
		icon: ClipboardCheck,
		label: "ASSIGN NEURODEVELOPMENT SPECIALIST",
	},
];
</script>
