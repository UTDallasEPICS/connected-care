/**
 * DB-backed therapy modalities (the "therapy types" in the note drilldown).
 *
 * Sourced from GET /api/therapy-modality (the editable `TherapyModality` /
 * `TherapyObjective` tables), replacing the former hardcoded therapyData.ts
 * constant. Labels are bilingual (labelEn/labelEs) and picked by the active
 * locale. Shared across components via a stable useAsyncData key so the list is
 * fetched once. `therapyTypeLabel` and `therapyTypeOptions` keep their previous
 * shapes so existing consumers (ViewNoteModal, NotesHistory, TherapyDrilldown)
 * don't change; `objectivesFor` is added for the drilldown's objectives list.
 * A note may cover several types at once (stored as `TherapyNoteType` rows),
 * hence `therapyTypeLabels` for rendering a list of them.
 */
interface ModalityObjective {
	kind: string; // "objective" | "header" | "subheader"
	labelEn: string;
	labelEs: string;
	order: number;
}
interface Modality {
	id: string;
	key: string;
	labelEn: string;
	labelEs: string;
	order: number;
	active: boolean;
	Objectives: ModalityObjective[];
}

type ObjectiveItem = string | { header?: string; subheader?: string };

export function useTherapyTypes() {
	const { locale } = useI18n();
	const { data } = useAsyncData<Modality[]>(
		"therapy-modalities",
		() => $fetch("/api/therapy-modality"),
		{ default: () => [] }
	);

	const modalities = computed(() => data.value ?? []);
	const isEs = computed(() => String(locale.value).startsWith("es"));

	const labelOf = (m: { labelEn: string; labelEs: string }): string =>
		isEs.value ? m.labelEs || m.labelEn : m.labelEn;

	function therapyTypeLabel(key: string | null | undefined): string {
		if (!key) return "";
		const m = modalities.value.find((x) => x.key === key);
		return m ? labelOf(m) : key;
	}

	const therapyTypeOptions = computed(() =>
		modalities.value
			.filter((m) => m.active)
			.map((m) => ({ label: labelOf(m), value: m.key }))
	);

	function objectivesFor(key: string | null | undefined): ObjectiveItem[] {
		if (!key) return [];
		const m = modalities.value.find((x) => x.key === key);
		if (!m) return [];
		return m.Objectives.map((obj) => {
			const label = isEs.value ? obj.labelEs || obj.labelEn : obj.labelEn;
			if (obj.kind === "header") return { header: label };
			if (obj.kind === "subheader") return { subheader: label };
			return label;
		});
	}

	function therapyTypeLabels(keys: string[] | null | undefined): string {
		if (!keys?.length) return "";
		return keys.map(therapyTypeLabel).join(", ");
	}

	/**
	 * TherapyDrilldown namespaces each objective checkbox's value as
	 * `${therapyType}::${label}` so the same objective label under two
	 * selected therapies doesn't collide. Strip that prefix back off for
	 * display (e.g. in the per-objective details textareas). Notes saved
	 * before multi-select stored bare labels, so keys without the separator
	 * are returned unchanged.
	 */
	function objectiveLabel(key: string): string {
		const sep = key.indexOf("::");
		return sep === -1 ? key : key.slice(sep + 2);
	}

	return {
		therapyTypeLabel,
		therapyTypeLabels,
		therapyTypeOptions,
		objectivesFor,
		objectiveLabel,
	};
}
