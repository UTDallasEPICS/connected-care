// \"./components/*.vue\" \"./pages/*.vue\"
// \"./i18n/locales/*.json\"

// const VueI18NExtract = require('vue-i18n-extract');
import VueI18NExtract from 'vue-i18n-extract';
import fs from 'fs';

const report = VueI18NExtract.createI18NReport({
    vueFiles: './{components,pages}/*.vue',
    languageFiles: './i18n/locales/*.json',
    add: true,
});

console.log(report);

// Load each locale file
/*for (const langFile of ['./i18n/locales/en.json', './i18n/locales/es.json']) {
  const data = JSON.parse(fs.readFileSync(langFile, 'utf8'));

  // Add missing keys for this language
  report.missingKeys
    .filter(k => k.language === langFile.includes('en') ? 'en' : 'es')
    .forEach(k => {
      if (!data[k.path]) {
        data[k.path] = '';
      }
    });

  fs.writeFileSync(langFile, JSON.stringify(data, null, 2));
}*/
