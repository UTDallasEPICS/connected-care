import fs from "fs";
import path from "path";

let esRaw = `
{
    «Crear cita»: «Crear cita»,
    «Nueva cita»: «Nueva cita»,
	«Fecha»: «Fecha»,
    «Elija un terapeuta»: «Elija un terapeuta»,
    «Elija un tipo de sesión»: «Elija un tipo de sesión»,
    «Asistencia máxima de pacientes (mín. 1)»: «Asistencia máxima de pacientes (mín. 1)»,
    «Comentarios»: «Comentarios»,
    «Cancelar»: «Cancelar»,
    «Guardar»: «Guardar»,
    «Terapeuta»: «Terapeuta»,
    «Máximo de pacientes»: «Máximo de pacientes»,
    «Espacio restante»: «Espacio restante»,
    «Pacientes que asisten»: «Pacientes que asisten»,
    «Edad»: «Edad»,
    «Género»: «Género»,
    «Ver perfil»: «Ver perfil»,
    «No hay pacientes»: «No»,
    «Notas de terapia»: «Notas de terapia»,
    «Editar cita»: «Editar cita»,
    «Tipo de sesión»: «»,
    «Hora»: «»,
    «Duración (minutos)»: «»,
    «Guardar cambios»: «»,
    «Filtrar citas»: «»,
    «Enviar»: «»,
    «Inicio»: «»,
    «Acerca de»: «»,
    «Contacto»: «»,
    «Cerrar sesión»: «»,
    «Notas del terapeuta»: «»,
    «Calendario»: «»,
    «Ver nuevos formularios de contacto»: «»,
    «Ver empleados»: «»,
    «Crear cuenta»: «»,
    «Nombre del paciente:»: «»,
    «Segundo nombre del paciente:»: «»,
    «Apellido del paciente:»: «»,
    «Sexo:»: «»,
    «Fecha de nacimiento:»: «»,
    «Nacionalidad:»: «»,
    «Número de identificación:»: «»,
    «Dirección, línea 1:»: «»,
    «Dirección, línea 2:»: «»,
    «Código postal:»: «»,
    «Localidad:»: «»,
    «País:»: «»,
    «Nombre del padre/madre:»: «»,
    «Apellido del padre/madre:»: «»,
    «Correo electrónico:»: «»,
    «Número de teléfono/Whatsapp:»: «»,
    «Seguro médico:»: «»,
    «Seleccione el seguro:»: «»,
    «Servicios/terapias preferidos:»: «»,
    «Envíe cualquier historial médico»: «»,
    «¿Ha sido paciente nuestro anteriormente?»: «»,
    «¿Le han diagnosticado formalmente?»: «»,
    «¿Desea realizar una evaluación diagnóstica al paciente?»: «»,
    «¿Algún comentario para el terapeuta?»: «»,
    «Enviar formulario»: «»
}
`;

let enRaw = `
{
    "Create Appointment": "Create Appointment",
    "New Appointment": "New Appointment",
	"Date": "Date",
    "Pick a therapist": "Pick a therapist",
    "Pick a session type": "Pick a session type",
    "Max Patient Attendance (Min. 1)": "Max Patient Attendance (Min. 1)",
    "Comments": "Comments",
    "Cancel": "Cancel",
    "Save": "Save",
    "Therapist": "Therapist",
    "Maximum Patients": "Maximum Patients",
    "Space Left": "Space Left",
    "Patients Attending": "Patients Attending",
    "Age": "Age",
    "Gender": "Gender",
    "View Profile": "View Profile",
    "No patients": "No patients",
    "Therapy Notes": "Therapy Notes",
    "Edit Appointment": "Edit Appointment",
    "Session Type": "",
    "Time": "",
    "Duration (Minutes)": "",
    "Save Changes": "",
    "Filter Appointments": "",
    "Submit": "",
    "Home": "",
    "About": "",
    "Contact": "",
    "Log Out": "",
    "Therapist’s Notes": "",
    "Schedule": "",
    "View New Contact Forms": "",
    "View Employees": "",
    "Create Account": "",
    "Patient First name:": "",
    "Patient Middle name:": "",
    "Patient Last name:": "",
    "Gender:": "",
    "Date of Birth:": "",
    "Nationality:": "",
    "ID Number:": "",
    "Address Line 1:": "",
    "Address Line 2:": "",
    "Postal Code:": "",
    "Locality:": "",
    "Country:": "",
    "Parent First Name:": "",
    "Parent Last Name:": "",
    "Email:": "",
    "Phone Number/Whatsapp:": "",
    "Medical Insurance:": "",
    "Select the insurance:": "",
    "Preferred Services/Therapies:": "",
    "Please submit any medical records": "",
    "Have you been a paitent previously with us?": "",
    "Have you been formally diagnosed?": "",
    "Do you want to perform a Diagnostic Evaluation on the patient?": "",
    "Any Comments for the therapist?": "",
    "Submit form": ""
}
`;

// Normalize to double quotes
let esNormalized = esRaw.replace(/[«»]/g, '"');
let esObj = JSON.parse(esNormalized);

let enNormalized = enRaw.replace(/[«»]/g, '"');
let enObj = JSON.parse(enNormalized);

let esKeys = Object.keys(esObj);
let enKeys = Object.keys(enObj);

let enPath = path.resolve("./i18n/locales/en.json");
let en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
for (let i = 0; i < enKeys.length; i++) {
	if (
		!en[enKeys[i]] ||
		(typeof en[enKeys[i]] === "string" && en[enKeys[i]].trim() === "")
	) {
		en[enKeys[i]] = enKeys[i];
	}
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

let esPath = path.resolve("./i18n/locales/es.json");
let es = JSON.parse(fs.readFileSync(esPath, "utf-8"));
for (let i = 0; i < esKeys.length; i++) {
	if (
		!es[esKeys[i]] ||
		(typeof es[esKeys[i]] === "string" && es[esKeys[i]].trim() === "")
	) {
		es[enKeys[i]] = esKeys[i];
	}
}
fs.writeFileSync(esPath, JSON.stringify(es, null, 2));
