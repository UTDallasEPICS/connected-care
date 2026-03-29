<template>
    <div v-if="loggedin" class="mt-[50px] flex justify-center p-5">
        <div class="w-full max-w-4xl">
        <div class="flex justify-center">
            <h1 class="text-[40px] mb-[30px]">
                Request Apointment Form
            </h1>
        </div>
        <h1 class="text-[30px]">
            What service do you want to schedule?
        </h1>
        <div class="flex flex-col mt-[20px] mb-[20px] gap-y-[20px]">
            
            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('First interview', (e.target as HTMLInputElement).checked)" />
                First interview (Entrevista inicial)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Evaluation appointment', (e.target as HTMLInputElement).checked)" />
                Evaluation appointment (Cita de evaluación)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Diagnostic tests', (e.target as HTMLInputElement).checked)" />
                Diagnostic Tests application (Aplicación de pruebas diagnósticas)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Delivery diagnostic report', (e.target as HTMLInputElement).checked)" />
                Delivery of diagnostic test report (Entrega de informe de pruebas diagnósticas)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Therapy program evaluation', (e.target as HTMLInputElement).checked)" />
                Therapy Program Evaluation (Evaluación de Programa terapéutico)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Psychological consultation', (e.target as HTMLInputElement).checked)" />
                Psychological consultation (Consulta psicológica)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Sexuality consultation', (e.target as HTMLInputElement).checked)" />
                Sexuality Consultation for Young People with ASD (Consulta Sexualidad para Jóvenes con TEA)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox"
                @change="e => toggleService('Other', (e.target as HTMLInputElement).checked)" />
                Other (we are planning to add other services like family therapy, and so on)
            </div>

        </div>

        <div class="flex justify-center">
            <button  @click.prevent="sendRequest" class="border-2 border-black bg-red-500 mt-[50px] w-[150px] h-[50px] text-bold-600 text-[20px] hover:bg-red-400 active:bg-red-300">
                Send Request
            </button>
        </div>
        </div>
        
    </div>

    <div v-else class="mt-[50px] flex justify-center p-5">
    <div class="w-full max-w-4xl">
        <div class="flex justify-center">
            <h1 class="text-[40px] mb-[30px]">
                Request Apointment Form
            </h1>
        </div>
        <h1 class="text-[30px]">
            What service do you want to schedule?
        </h1>

        <div class="flex flex-col mt-[20px] mb-[20px] gap-y-[20px]">

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Evaluation appointment" v-model="services" />
                Evaluation appointment (Cita de evaluación)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Diagnostic tests" v-model="services" />
                Diagnostic Tests application (Aplicación de pruebas diagnósticas)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Delivery diagnostic report" v-model="services" />
                Delivery of diagnostic test report (Entrega de informe de pruebas diagnósticas)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Therapy program evaluation" v-model="services" />
                Therapy Program Evaluation (Evaluación de Programa terapéutico)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Psychological consultation" v-model="services" />
                Psychological consultation (Consulta psicológica)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Sexuality consultation" v-model="services" />
                Sexuality Consultation for Young People with ASD (Consulta Sexualidad para Jóvenes con TEA)
            </div>

            <div class="flex flex-row gap-x-[10px]">
                <input type="checkbox" value="Other" v-model="services" />
                Other (we are planning to add other services like family therapy, and so on)
            </div>
            <p v-if="errors.services" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.services }}
                </p>

        </div>

        <!-- FORM (UNCHANGED) -->
        <div class="grid grid-cols-3 gap-9 mt-[70px]">
            <div class="flex flex-col">
                <label  class="text-lg font-medium">First name: <span class="text-red-500">*</span></label>
                <input v-model="firstName" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.firstName" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.firstName }}
                </p>
            </div>

            <div class="flex flex-col">
                <label class="text-lg font-medium">Middle name:</label>
                <input v-model="middleName" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                
            </div>

            <div class="flex flex-col">
                <label class="text-lg font-medium">Last name: <span class="text-red-500">*</span></label>
                <input v-model="lastName" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.lastName" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.lastName }}
                </p>
            </div>

            <div class="flex flex-col col-span-3">
                <label class="text-lg font-medium">Email: <span class="text-red-500">*</span></label>
                <input v-model="email" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.email" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.email }}
                </p>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-9 mt-[35px]">
            <div class="flex flex-col">
                <label class="text-lg font-medium">Phone: <span class="text-red-500">*</span></label>
                <input v-model="phone" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.phone" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.phone }}
                </p>
            </div>

            <div class="flex flex-col">
                <label class="text-lg font-medium">Whatsapp: <span class="text-red-500">*</span></label>
                <input v-model="whatsapp" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.whatsapp" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.whatsapp }}
                </p>
            </div>

            
            

            

            <div class="flex flex-col">
                <label class="text-lg font-medium">ID number: <span class="text-red-500">*</span></label>
                <input v-model="idNumber" class="input h-[40px] w-full rounded-md border border-gray-300 p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <p v-if="errors.idNumber" class="h-[40px] w-[250px] rounded-md  p-2 text-[18px] text-red-500 mr-[20px] ">
                {{ errors.idNumber }}
                </p>
            </div>
        </div>

        <div class="flex justify-center">
            <button @click.prevent="sendRequest" class="border-2 border-black bg-red-500 mt-[50px] w-[150px] h-[50px] text-bold-600 text-[20px] hover:bg-red-400 active:bg-red-300">
                Send Request
            </button>
        </div>

    </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { $fetch } from 'ofetch'

const loggedin = useState("loggedin")
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const idNumber = ref('')
const whatsapp=ref('');
const services = ref<string[]>([])

function toggleService(service: string, checked: boolean) {
  if (checked) services.value.push(service)
  else services.value = services.value.filter(s => s !== service)
}
const errors = reactive({ firstName: '', middleName:'', lastName:'', email:'', phone:'', whatsapp:'',  idNumber:'', services:''})

const router = useRouter()


async function sendRequest() {
    errors.firstName='';
    errors.lastName='';
    errors.middleName='';
    errors. email='';
    errors.phone='';
    errors.whatsapp='';
    errors.idNumber='';
    errors.services='';
    if (services.value.length==0){
        errors.services = 'You must pick at least one';
        return;
    }
    else{
        errors.services = '';
    }

    if (firstName.value==""){
        errors.firstName = 'Please fill out this field!';
        return;
    }
    else{
        errors.firstName = '';
    }
    if (lastName.value==""){
        errors.lastName = 'Please fill out this field!';
        return;
    }
    else{
        errors.lastName = '';
    }

     if (email.value==""){
        errors.email = 'Please fill out this field!';
        return;
    }
    else{
        errors.email = '';
    }
    if (phone.value==""){
        errors.phone = 'Please fill out this field!';
        return;
    }
    else{
        errors.phone = '';
    }
    if (whatsapp.value==""){
        errors.whatsapp = 'Please fill out this field!';
        return;
    }
    else{
        errors.whatsapp = '';
    }

    if (idNumber.value==""){
        errors.idNumber = 'Please fill out this field!';
        return;
    }
    else{
        errors.idNumber = '';
    }

    if (!(email.value.endsWith("@email.com") || email.value.endsWith("@gmail.com") || email.value.endsWith("@hotmail.com") || email.value.endsWith("@yahoo.com"))){
        errors.email='Not a valid email';
        return;
    }
    else{
        errors.email='';
    }
    if (phone.value.length!=10){
        errors.phone='Not a valid phone';
        return;
    }
    
    for (let i = 0; i < phone.value.length; i++) {
    if (!Number.isInteger(Number(phone.value[i]))) {
        errors.phone = 'Not a valid phone';
        return;
    }
    }   
        errors.phone = ''; // after loop


    if (whatsapp.value.length != 10) {
        errors.whatsapp = 'Not a valid WhatsApp number';
        return;
    }

    for (let i = 0; i < whatsapp.value.length; i++) {
        if (!Number.isInteger(Number(whatsapp.value[i]))) {
        errors.whatsapp = 'Not a valid WhatsApp number';
        return;
    }
    }
errors.whatsapp = '';


    if (idNumber.value.length!=11){
        errors.idNumber='Not a valid id';
        return;
    }
    
    for (let i = 0; i < idNumber.value.length; i++) {
        if (!Number.isInteger(Number(idNumber.value[i]))){
            errors.idNumber='Not a valid id';
            return;
        }
    
        }
    errors.idNumber='';
    
    


  try {
    const res = await $fetch('/api/sendRequest/form', {
      method: 'POST',
      body: {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        whatsapp:whatsapp.value,
        idNumber: idNumber.value,
        services: services.value
      }
    })

    if (res.success) {
      alert('Request sent successfully!')
    } else {
      alert('Failed to send request.')
    }
  } catch (err) {
    console.error(err)
    alert('Error sending request.')
  }
  
  router.push("/login");
}


</script>