<template>
	<DashboardButtonGrid :buttons="parentButtons" />
</template>
<script lang="ts" setup>
import { navigateTo, useCookie } from "#imports";
import { onMounted } from "vue";
import { AccessPermission } from "~/types/permissions";
import { Calendar, User } from "lucide-vue-next";
import DashboardButtonGrid from "~/components/DashboardButtonGrid.vue";

const access = useCookie("AccessPermission");

onMounted(() => {
	if (!access.value?.[AccessPermission.PARENT]) {
		navigateTo("/dashboard");
	}
});

const parentButtons = [
	{
		path: "/scheduleView",
		icon: Calendar,
		label: "SCHEDULE",
	},
	{
		path: { name: "childSearch" },
		icon: User,
		label: "VIEW CHILDREN'S PROFILES",
	},
];
</script>
