<template>
	<DashboardButtonGrid :buttons="parentButtons" />
</template>
<script lang="ts" setup>
import { Calendar, User } from "lucide-vue-next";

useDashboardGuard("PARENT");

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
