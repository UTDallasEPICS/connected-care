<template>
    <div>
        <TextInput 
            v-if="['text', 'number', 'tel', 'email'].includes(fieldConfig.type)"
            v-model="model"
            :field-config="fieldConfig"
        />
        <DateInput
            v-else-if="fieldConfig.type == 'date'"
            v-model="model"
            :field-config="fieldConfig" 
        />
        <MultitextInput 
            v-else-if="fieldConfig.type == 'multitext'"
            v-model="model"
            :field-config="fieldConfig" 
        />
        <SelectInput 
            v-else-if="fieldConfig.type == 'select'"
            v-model="model"
            :field-config="fieldConfig" 
        />
        <MultiselectInput
            v-else-if="fieldConfig.type == 'multiselect'"
            v-model="model"
            :field-config="fieldConfig" 
        />
        <FileInput
            v-else-if="fieldConfig.type == 'file'"
            v-model="model"
            :field-config="fieldConfig" 
        />
    </div>
</template>

<script setup lang="ts">
    import type { FormFieldConfig, FormFieldValue } from '~/types/FormConfig/formConfig';

    defineProps<{ fieldConfig: FormFieldConfig }>()
    const model = defineModel<FormFieldValue>();
</script>
