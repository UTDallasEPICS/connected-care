<template>
	<div class="font-karla">
		<div class="flex h-auto place-content-center">
			<div
				class="w-full max-w-5xl flex-col flex-wrap font-light md:w-180"
			>
				<h1 class="mt-5 ml-5 text-4xl sm:mr-5 sm:ml-0">
					Therapist’s Notes
				</h1>

				<!-- content goes here next step -->
				<div class="p-5 text-lg">
					<div class="rounded-xl bg-white p-5 shadow">
						<!-------- Session header (prefill later)----------->

						User's full name: User's age: Date of birth: Age:
						Diagnosis: Record number: Sex: Medication: Allergies:
						Diet: Parent/Guardian's name:
						<section>
							<h2 class="mb-4 text-2xl font-semibold">
								Session Information
							</h2>
							<div class="mb-6 grid grid-cols-1 gap-4"></div>
						</section>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>
