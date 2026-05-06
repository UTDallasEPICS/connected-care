<template>
	<DashboardButtonGrid :buttons="iTServiceButtons" />
</template>

<script lang="ts" setup>
import { Calendar, FileText, Users, UserPlus } from "lucide-vue-next";
import { useDashboardGuard } from "~/composables/auth/useDashboardGuard";

useDashboardGuard("IT_SERVICE");

const iTServiceButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "Schedule",
	},
	{
		path: "/viewContactForms",
		icon: FileText,
		label: "View New Contact Forms",
	},
	{
		path: "/employeeSearch",
		icon: Users,
		label: "View Employees",
	},
	{
		path: "/admin/createAccount",
		icon: UserPlus,
		label: "Create Account",
	},
];
</script>
