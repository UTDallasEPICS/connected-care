<template>
	<DashboardButtonGrid :buttons="adminButtons" />
</template>

<script lang="ts" setup>
import { useCookie, navigateTo } from "#imports";
import { AccessPermission } from "~/types/permissions";
import { Calendar, FileText, Users, UserPlus } from "lucide-vue-next";
import DashboardButtonGrid from "~/components/DashboardButtonGrid.vue";

const access = useCookie("AccessPermission");

if (!access.value?.[AccessPermission.ADMIN]) {
	navigateTo("/dashboard");
}

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
