import { reactive } from "vue";

export function useModalToggle<T extends string>(
	...names: T[]
): {
	modals: Record<T, boolean>;
	openModal: (name: T) => void;
	closeModal: (name: T) => void;
	toggleModal: (name: T) => void;
} {
	const modals = reactive(
		Object.fromEntries(names.map((n) => [n, false]))
	) as Record<T, boolean>;

	function openModal(name: T) {
		modals[name] = true;
	}

	function closeModal(name: T) {
		modals[name] = false;
	}

	function toggleModal(name: T) {
		modals[name] = !modals[name];
	}

	return { modals, openModal, closeModal, toggleModal };
}
