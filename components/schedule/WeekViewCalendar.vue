<template>
	<div class="font-sc-encode overflow-auto">
		<div class="grid min-w-[980px] grid-cols-6 text-center">
			<div class="bg-blay border-smoky border p-2 text-lg font-semibold">
				Time
			</div>
			<div
				v-for="day in dayNames"
				:key="day"
				class="bg-blay border-smoky border p-2 text-lg font-semibold"
			>
				{{ day }}
			</div>

			<div class="border-smoky border">
				<div
					v-for="hour in hours"
					:key="`time-${hour}`"
					class="border-smoky h-[104px] border-b px-2 py-1 text-left text-sm"
				>
					{{ militaryTimeToTwelveHr(hour) }}
				</div>
			</div>

			<div
				v-for="dayIndex in 5"
				:key="`day-col-${dayIndex}`"
				class="border-smoky relative border"
			>
				<div
					v-for="hour in hours"
					:key="`grid-${dayIndex}-${hour}`"
					class="border-smoky h-[104px] border-b"
				></div>

				<div
					v-for="session in thisWeekSessions[dayIndex - 1]"
					:key="session.id"
					class="absolute right-0 left-0 mx-1 rounded border-2 border-blue-950/50 bg-blue-100 px-2 py-1 text-left text-xs shadow-sm"
					:style="{
						top: getSessionTop(session),
						height: getSessionHeight(session),
					}"
				>
					<div class="truncate font-bold">
						{{ session.Type?.name }}
					</div>
					<div class="truncate">
						{{ session.Therapist?.fName }}
						{{ session.Therapist?.lName }}
					</div>
					<div>{{ getSessionDurationLabel(session) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useCookie, useFetch, watch } from "#imports";
import { AccessPermission } from "~/types/permissions";

type SessionDetails = {
	id: string;
	time: string | Date;
	duration: number;
	typeId: string;
	Type: { name: string } | null;
	Therapist: { fName: string | null; lName: string | null } | null;
};

const props = defineProps<{
	week: Date;
	filter?: string[];
}>();

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const access = useCookie<Record<string, boolean> | null>("AccessPermission");
const userId = useCookie<string | null>("userId");

const sessions = ref<SessionDetails[]>([]);

watch(
	() => [props.week, props.filter, access.value, userId.value],
	() => {
		void refreshSessions();
	},
	{ immediate: true, deep: true }
);

async function refreshSessions() {
	const queryBase = {
		date: props.week.toISOString(),
	};

	if (!access.value) {
		sessions.value = [];
		return;
	}

	if (
		access.value[AccessPermission.ADMIN] ||
		access.value[AccessPermission.USER_SERVICE]
	) {
		const query = {
			...queryBase,
			filter: props.filter?.length ? props.filter : undefined,
		};
		const { data } = await useFetch<SessionDetails[]>(
			"/api/session/schedule/all",
			{
				method: "GET",
				query,
				default: () => [],
			}
		);
		sessions.value = data.value ?? [];
		return;
	}

	if (access.value[AccessPermission.THERAPIST] && userId.value) {
		const { data } = await useFetch<SessionDetails[]>(
			"/api/session/schedule/therapist",
			{
				method: "GET",
				query: { ...queryBase, userId: userId.value },
				default: () => [],
			}
		);
		sessions.value = data.value ?? [];
		return;
	}

	if (userId.value) {
		const { data } = await useFetch<SessionDetails[]>(
			"/api/session/schedule/patient",
			{
				method: "GET",
				query: { ...queryBase, userId: userId.value },
				default: () => [],
			}
		);
		sessions.value = data.value ?? [];
		return;
	}

	sessions.value = [];
}

const thisWeekSessions = computed(() => {
	const grouped: SessionDetails[][] = [[], [], [], [], []];

	for (const session of sessions.value) {
		const day = new Date(session.time).getDay();
		if (day >= 1 && day <= 5) {
			grouped[day - 1]?.push(session);
		}
	}

	for (let i = 0; i < grouped.length; i++) {
		grouped[i]?.sort((a, b) => {
			return new Date(a.time).getTime() - new Date(b.time).getTime();
		});
	}

	return grouped;
});

const startHr = computed(() => {
	let earliest = 23;
	let found = false;

	for (const day of thisWeekSessions.value) {
		for (const session of day) {
			found = true;
			earliest = Math.min(earliest, new Date(session.time).getHours());
		}
	}

	return found ? earliest : 8;
});

const endHr = computed(() => {
	let latest = 0;
	let found = false;

	for (const day of thisWeekSessions.value) {
		for (const session of day) {
			found = true;
			const start = new Date(session.time);
			const end = new Date(
				start.getTime() + session.duration * 60 * 1000
			);
			latest = Math.max(
				latest,
				end.getHours() + (end.getMinutes() > 0 ? 1 : 0)
			);
		}
	}

	return found ? Math.max(latest, startHr.value + 1) : 17;
});

const hours = computed(() => {
	const list: number[] = [];
	for (let hr = startHr.value; hr <= endHr.value; hr++) {
		list.push(hr);
	}
	return list;
});

const pixelsPer15Min = 26;

function getSessionTop(session: SessionDetails) {
	const date = new Date(session.time);
	const minutesFromTop =
		(date.getHours() - startHr.value) * 60 + date.getMinutes();
	return `${(minutesFromTop / 15) * pixelsPer15Min}px`;
}

function getSessionHeight(session: SessionDetails) {
	return `${Math.max((session.duration / 15) * pixelsPer15Min, 24)}px`;
}

function getSessionDurationLabel(session: SessionDetails) {
	const start = new Date(session.time);
	const end = new Date(start.getTime() + session.duration * 60 * 1000);
	const sMin = String(start.getMinutes()).padStart(2, "0");
	const eMin = String(end.getMinutes()).padStart(2, "0");
	return `${start.getHours()}:${sMin} - ${end.getHours()}:${eMin}`;
}

function militaryTimeToTwelveHr(h: number): string {
	if (h < 0 || h > 23) return "ERROR";
	if (h === 0) return "12 AM";
	if (h < 12) return `${h} AM`;
	if (h === 12) return "12 PM";
	return `${h - 12} PM`;
}
</script>
