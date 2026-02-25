<template>
	<div
		v-if="modelValue"
		class="fixed inset-0 z-50 flex items-center justify-center"
		aria-modal="true"
		role="dialog"
	>
		<!-- Dimmed Background -->
		<div
			class="absolute inset-0 bg-black/70"
			@click.self="$emit('update:modelValue', false)"
		></div>

		<!-- Modal Content -->
		<div
			class="max-w-7/12 relative z-10 w-full overflow-y-auto bg-white p-6 shadow-md"
			@click.stop
		>
			<h2 class="mb-4 text-xl font-bold">Edit Profile</h2>
			<form @submit.prevent="$emit('save', formData)">
				<!-- Name -->
				<div
					class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
				>
					<div class="w-full">
						<label class="mb-1 block font-medium" for="fname">
							First Name <span class="text-red-500">*</span>
						</label>
						<input
							id="fname"
							v-model="formData.fName"
							type="text"
							required
							class="input w-full"
							placeholder="Enter your first name"
						/>
					</div>
					<div class="lg:w-lg 2xl:w-xl w-full">
						<label class="mb-1 block font-medium" for="minit">
							Middle Initial
						</label>
						<input
							id="minit"
							v-model="formData.mInit"
							type="text"
							class="input w-full"
							placeholder="Enter your initial"
						/>
					</div>
					<div class="w-full">
						<label class="mb-1 block font-medium" for="lname">
							Last Name <span class="text-red-500">*</span>
						</label>
						<input
							id="lname"
							v-model="formData.lName"
							type="text"
							required
							class="input w-full"
							placeholder="Enter your last name"
						/>
					</div>
				</div>

				<!-- DOB -->
				<div class="mb-4">
					<label class="mb-1 block font-medium" for="dob">
						DOB <span class="text-red-500">*</span>
					</label>
					<input
						id="dob"
						v-model="formData.dob"
						type="date"
						required
						class="input w-full"
						placeholder="Enter your email"
					/>
				</div>

				<!-- Gender -->
				<div class="mb-4">
					<label class="mb-1 block font-medium">
						Gender <span class="text-red-500">*</span>
					</label>
					<select v-model="formData.gender" class="input w-full">
						<option v-for="(type, index) in gender" :key="index">
							{{ type }}
						</option>
					</select>
				</div>

				<!-- Email -->
				<div class="mb-4">
					<label class="mb-1 block font-medium" for="email">
						Email <span class="text-red-500">*</span>
					</label>
					<input
						id="email"
						v-model="formData.email"
						type="email"
						required
						class="input w-full"
						placeholder="Enter your email"
					/>
				</div>

				<!-- Phone -->
				<div class="mb-4">
					<label class="mb-1 block font-medium" for="phone">
						Phone <span class="text-red-500">*</span>
					</label>
					<input
						id="phone"
						v-model="formData.phone"
						type="text"
						required
						class="input w-full"
						placeholder="Enter your phone number"
					/>
				</div>

				<!-- What's App -->
				<div class="mb-4">
					<label class="mb-1 block font-medium" for="whatsapp">
						What's App <span class="text-red-500">*</span>
					</label>
					<input
						id="whatsapp"
						v-model="formData.whatsApp"
						type="text"
						required
						class="input w-full"
						placeholder="Enter your what's app number"
					/>
				</div>

				<!-- Contact Preference -->
				<div class="mb-4">
					<label class="mb-1 block font-medium">
						Contact Preference
						<span class="text-red-500">*</span>
					</label>
					<select v-model="formData.contactPref" class="input w-full">
						<option
							v-for="(type, index) in contactType"
							:key="index"
						>
							{{ type }}
						</option>
					</select>
				</div>

				<!-- Address -->
				<div
					class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
				>
					<div class="w-full">
						<label class="mb-1 block font-medium" for="address">
							Address
						</label>
						<input
							id="address"
							v-model="formData.address"
							type="text"
							class="input w-full"
							placeholder="Enter your address"
						/>
					</div>
					<div class="w-md">
						<label class="mb-1 block font-medium" for="buildingNum">
							Building Number
						</label>
						<input
							id="buildingNum"
							v-model="formData.buildNum"
							type="number"
							class="input w-full"
							placeholder="Enter your address"
						/>
					</div>
				</div>

				<!-- City & Postcode -->
				<div
					class="mb-4 flex w-full flex-col justify-between gap-4 lg:flex-row 2xl:gap-8"
				>
					<div class="w-full">
						<label class="mb-1 block font-medium" for="city">
							City <span class="text-red-500">*</span>
						</label>
						<input
							id="city"
							v-model="formData.city"
							type="text"
							required
							class="input w-full"
							placeholder="Enter your city"
						/>
					</div>
					<div class="w-full">
						<label class="mb-1 block font-medium" for="postcode">
							Post Code <span class="text-red-500">*</span>
						</label>
						<input
							id="postcode"
							v-model="formData.postCode"
							type="number"
							required
							class="input w-full"
							placeholder="Enter your post code"
						/>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-end space-x-2">
					<button
						type="button"
						class="bg-blay px-2 hover:cursor-pointer"
						@click="$emit('update:modelValue', false)"
					>
						Cancel
					</button>
					<button type="submit" class="btn hover:cursor-pointer">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const contactType = ["EMAIL", "PHONE", "WHATS_APP"];
const gender = ["MALE", "FEMALE", "OTHER"];

interface FormData {
	fName: string;
	mInit: string;
	lName: string;
	dob: string;
	gender: string;
	email: string;
	phone: string;
	whatsApp: string;
	contactPref: string;
	address: string;
	buildNum: string | number;
	city: string;
	postCode: string;
	identification?: string;
	diagnosed?: boolean;
}

interface Profile {
	fName?: string;
	mInit?: string;
	lName?: string;
	email?: string;
	phone?: string;
	whatsApp?: string;
	contactPref?: string;
	NonEmployee?: {
		dob?: string;
		gender?: string;
		streetNum?: string | number;
		streetName?: string;
		buildingNum?: string | number;
		postCode?: string;
		PostCodeCity?: {
			city?: string;
		};
		Patient?: {
			identification?: string;
			diagnosed?: boolean;
		};
	};
}

const props = defineProps<{
	modelValue: boolean;
	profile: Profile;
}>();

defineEmits<{
	"update:modelValue": [value: boolean];
	save: [data: FormData];
}>();

const formData = ref<FormData>({
	fName: "",
	mInit: "",
	lName: "",
	dob: "",
	gender: "",
	email: "",
	phone: "",
	whatsApp: "",
	contactPref: "",
	address: "",
	buildNum: "",
	city: "",
	postCode: "",
});

watch(
	() => props.modelValue,
	(newVal) => {
		if (newVal && props.profile) {
			// Pre-populate form with profile data
			formData.value.fName = props.profile.fName || "";
			formData.value.mInit = props.profile.mInit || "";
			formData.value.lName = props.profile.lName || "";
			formData.value.email = props.profile.email || "";
			formData.value.phone = props.profile.phone || "";
			formData.value.whatsApp = props.profile.whatsApp || "";
			formData.value.contactPref = props.profile.contactPref || "";

			if (props.profile?.NonEmployee?.dob) {
				formData.value.dob =
					props.profile.NonEmployee.dob.split("T")[0];
			}
			if (props.profile?.NonEmployee?.gender) {
				formData.value.gender = props.profile.NonEmployee.gender;
			}
			if (props.profile?.NonEmployee) {
				formData.value.address =
					`${props.profile.NonEmployee.streetNum || ""} ${
						props.profile.NonEmployee.streetName || ""
					}`.trim();
				formData.value.buildNum =
					props.profile.NonEmployee.buildingNum || "";
			}
			if (props.profile?.NonEmployee?.PostCodeCity?.city) {
				formData.value.city =
					props.profile.NonEmployee.PostCodeCity.city;
			}
			if (props.profile?.NonEmployee?.postCode) {
				formData.value.postCode = props.profile.NonEmployee.postCode;
			}
		}
	}
);
</script>
