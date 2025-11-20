// scripts/i18n-fill.js
import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";
import { franc } from "franc";

const enPath = path.resolve("./i18n/locales/en.json");
const esPath = path.resolve("./i18n/locales/es.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
const es = JSON.parse(fs.readFileSync(esPath, "utf-8"));

// const translator = await pipeline('translation', 'Xenova/m2m100_418M');

const enToEsTranslator = await pipeline("translation", "Xenova/opus-mt-en-es");
const esToEnTranslator = await pipeline("translation", "Xenova/opus-mt-es-en");

const WHITELISTED_LANGS = ["eng", "spa"];

function detectLanguage(text) {
	console.log("detectLanguage called with:", text);
	if (typeof text !== "string" || !text.trim()) {
		return null;
	}

	const code = franc(text, { whitelist: WHITELISTED_LANGS });

	console.log(`Detected language for "${text}": ${code}`);

	if (code === "eng") return "en";
	if (code === "spa") return "es";

	return null;
}

async function translateBetweenEnEs(text, sourceLang, targetLang) {
	// const detected = detectLanguage(text) || (targetLang === 'es' ? 'en' : 'es');

	if (sourceLang === targetLang) {
		return text;
	}

	console.log(`Translating from ${sourceLang} to ${targetLang}: "${text}"`);

	const result = await (
		targetLang === "es" ? enToEsTranslator : esToEnTranslator
	)(text);

	return result[0].translation_text;
}

console.log("en.json keys: ", Object.keys(en));
console.log("es.json keys: ", Object.keys(es));

const keyStates = {};

for (const key of Object.keys(en)) {
	if (!en[key] || (typeof en[key] === "string" && en[key].trim() === "")) {
		const detectedLang = detectLanguage(key) || "en";
		en[key] = await translateBetweenEnEs(key, detectedLang, "en");
		keyStates[key] = detectedLang;
		console.log(`Filled missing EN key: "${key}" -> "${en[key]}"`);
	}
}

for (const key of Object.keys(es)) {
	if (!es[key] || (typeof es[key] === "string" && es[key].trim() === "")) {
		const detectedLang = keyStates[key] || "en";
		es[key] = await translateBetweenEnEs(key, detectedLang, "es");
		console.log(`Filled missing ES key: "${key}" -> "${es[key]}"`);
	}
}

/*
// Fill missing values
for (const key of Object.keys(en)) {
  if (!es[key] || (typeof es[key] === 'string' && es[key].trim() === '')) {
    es[key] = await translateBetweenEnEs(en[key], 'es');
    console.log(`EN/ES DETECTED --> ES: ${en[key]} --> ${es[key]}`);
  }
}

for (const key of Object.keys(es)) {
  if (!en[key] || (typeof en[key] === 'string' && en[key].trim() === '')) {
    const preferredSourceLang = enKeyLanguageState[key] || detectLanguage(es[key]) || 'es';
    const targetLang = preferredSourceLang === 'en' ? 'es' : 'en';

    en[key] = await translateBetweenEnEs(es[key], targetLang);
    console.log(`ES/EN DETECTED --> ${targetLang.toUpperCase()}: ${es[key]} --> ${en[key]}`);
  }
}
*/

// Save updated files
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(esPath, JSON.stringify(es, null, 2));

console.log("i18n fill complete: en.json and es.json updated");
