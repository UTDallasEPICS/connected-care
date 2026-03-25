<template>
	<button v-if="userId" :class="getClass()" @click="logout">
		<LogOut v-if="!props.mobile" />
		<span v-else>{{ $t("Log Out") }}</span>
	</button>
</template>

<script setup lang="ts">
import { LogOut } from "lucide-vue-next";
const { userId } = useAuthState();
const { logout } = useLogout();

const desktopClass = "cursor-pointer";
const mobileClass = "py-2 text-end text-lg hover:underline";

const props = defineProps({
	mobile: Boolean,
});

const getClass = () => {
	return props.mobile ? mobileClass : desktopClass;
};
</script>
