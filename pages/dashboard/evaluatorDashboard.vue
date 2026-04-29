<template>
	<DashboardButtonGrid :buttons="evaluatorButtons" />
</template>
<script lang="ts" setup>

import { Calendar, Users, FileText } from "lucide-vue-next";
useDashboardGuard("EVALUATOR");

const evaluatorButtons = [
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

	{
        path: "/viewContactForms",
        icon: FileText,
        label: "VIEW NEW CONTACT FORMS",
    },
	
];
</script>