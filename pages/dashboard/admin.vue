<template>
	<DashboardButtonGrid :buttons="adminButtons" />
</template>

<script lang="ts" setup>
import { Calendar, FileText, Users, UserPlus } from "lucide-vue-next";

useDashboardGuard("ADMIN");

const adminButtons = [
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
		path: "/userSearch",
		icon: Users,
		label: "View Users",
	},
	{
		path: "/createAccount",
		icon: UserPlus,
		label: "Create Account",
	},
];
</script>
