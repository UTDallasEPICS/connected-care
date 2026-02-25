<template>
	<DashboardButtonGrid :buttons="userServiceButtons" />
</template>

<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { onMounted } from "vue";
import { AccessPermission } from "~/types/permissions";
import { Calendar, Users, FileText } from "lucide-vue-next";
import DashboardButtonGrid from "~/components/DashboardButtonGrid.vue";

const access = useCookie("AccessPermission");

onMounted(() => {
	if (!access.value?.[AccessPermission.USER_SERVICE]) {
		navigateTo("/dashboard");
	}
});

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
