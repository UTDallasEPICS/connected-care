// types/translator.d.ts
declare module '#app' {
  interface NuxtApp {
    $translate: (text: string) => Promise<string>
  }
}

export {}