<template>
	<div class="mt-[50px] flex justify-center p-5">
		<div class="w-full max-w-4xl">
			<h1 class="mb-8 text-center text-3xl font-bold">
				Create New Account
			</h1>

			<!-- 2x3 grid for inputs -->
			<div class="grid grid-cols-2 gap-6">
				<!-- First Name -->
				<div class="flex flex-col">
					<label for="firstName" class="text-lg font-medium">
						First Name: <span class="text-red-500">*</span>
					</label>
					<input
						id="firstName"
						type="text"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<!-- Middle Initial -->
				<div class="flex flex-col">
					<label for="middleInitial" class="text-lg font-medium">
						Middle Initial:
					</label>
					<input
						id="middleInitial"
						type="text"
						maxlength="1"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<!-- Last Name -->
				<div class="flex flex-col">
					<label for="lastName" class="text-lg font-medium">
						Last Name: <span class="text-red-500">*</span>
					</label>
					<input
						id="lastName"
						type="text"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<!-- Email -->
				<div class="flex flex-col">
					<label for="email" class="text-lg font-medium">
						Email: <span class="text-red-500">*</span>
					</label>
					<input
						id="email"
						type="email"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<!-- Phone -->
				<div class="flex flex-col">
					<label for="phone" class="text-lg font-medium">
						Phone: <span class="text-red-500">*</span>
					</label>
					<input
						id="phone"
						type="tel"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<!-- WhatsApp -->
				<div class="flex flex-col">
					<label for="whatsapp" class="text-lg font-medium">
						WhatsApp: <span class="text-red-500">*</span>
					</label>
					<input
						id="whatsapp"
						type="tel"
						class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>
			</div>
			<div class="mt-[25px] flex flex-row gap-x-[30px]">
				<div class="flex w-full flex-col sm:w-80">
					<label for="gender" class="text-lg font-medium">
						Gender: <span class="text-red-500">*</span>
					</label>

					<select
						id="gender"
						v-model="gender"
						class="input h-[50px] w-[280px] rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="" disabled>Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<div class="flex w-full flex-col sm:w-80">
					<label for="contact" class="text-lg font-medium">
						Contact Preference: <span class="text-red-500">*</span>
					</label>

					<select
						id="contact"
						v-model="contact_pref"
						class="input h-[50px] w-[280px] rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="" disabled>Select Preference</option>
						<option value="Email">Email</option>
						<option value="Text">Text</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<div class="flex w-full flex-col sm:w-80">
					<label for="type" class="text-lg font-medium">
						Account Type: <span class="text-red-500">*</span>
					</label>

					<select
						id="type"
						v-model="account_type"
						class="input h-[50px] w-[280px] rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="" disabled>Select Type</option>
						<option value="Patient">Patient</option>
						<option value="Therapist">Therapist</option>
						<option value="Admin">Admin</option>
						<option value="Parent">Parent</option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="flex justify-center">
		<button
			class="mt-[20px] h-[50px] w-[150px] bg-blue-500 text-lg hover:bg-blue-400 active:bg-blue-300"
		>
			Create Account
		</button>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const gender = ref("");
const contact_pref = ref("");
const account_type = ref("");
</script>
