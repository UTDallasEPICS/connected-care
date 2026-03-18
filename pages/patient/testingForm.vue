<template>
<div class="flex flex-col justify-start items-center">
    <h1 class="text-4xl mt-10">Patient Contact Form</h1>
    <form>
        <div
            v-for="section in formBlueprint"
            :key="section.sectionTitle"
        >
            <h2>
                {{ section.sectionTitle }}
            </h2>

            <div class="flex flex-col justify-start items-center">
                <div
                    v-for="field in section.fields"
                    :key="field.name"
                >
                    <FormDynamicInput v-model="formData[field.name]" :field-config="field" />
                </div>
            </div>
        </div>
    </form>
</div>

</template>

<script setup lang="ts">
    import { formBlueprint } from '~/types/FormConfig';
    import type { FormFieldValue } from '~/types/FormConfig/formConfig';

    const formData = ref<Record<string, FormFieldValue>>({})
</script>

