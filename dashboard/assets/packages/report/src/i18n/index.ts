// SPDX-FileCopyrightText: 2025 Contributors
// SPDX-License-Identifier: MIT

type LocaleDict = Record<string, string>

import zh from "./locales/zh.json"
import en from "./locales/en.json"

export type Language = "zh" | "en"

const dictionaries: Record<Language, LocaleDict> = {
  zh: zh as LocaleDict,
  en: en as LocaleDict
}

const STORAGE_KEY = "xk6-lang"

function readLangFromQuery(): Language | undefined {
  try {
    const p = new URLSearchParams(window.location.search)
    const lang = p.get("lang") as Language | null
    if (lang === "zh" || lang === "en") return lang
  } catch {}
  return undefined
}

function readLangFromStorage(): Language | undefined {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY) as Language | null
    if (v === "zh" || v === "en") return v
  } catch {}
  return undefined
}

function readLangFromBootstrap(): Language | undefined {
  const anyWindow = window as any
  const v = anyWindow.__DASHBOARD_LANG__ as Language | undefined
  if (v === "zh" || v === "en") return v
  return undefined
}

function readLangFromNavigator(): Language {
  const n = (navigator.language || "en").toLowerCase()
  if (n.startsWith("zh")) return "zh"
  return "en"
}

export function resolveInitialLanguage(): Language {
  return (
    readLangFromQuery() ||
    readLangFromStorage() ||
    readLangFromBootstrap() ||
    readLangFromNavigator()
  )
}

let currentLang: Language = resolveInitialLanguage()

export function getLanguage(): Language {
  return currentLang
}

export function setLanguage(lang: Language) {
  currentLang = lang
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {}
}

export function t(key: string): string {
  const dict = dictionaries[currentLang]
  const alt = dictionaries.en

  function getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, k) => (current ? current[k] : undefined), obj)
  }

  const nested = getNestedValue(dict, key)
  const direct = (dict as any)[key]
  const altNested = getNestedValue(alt, key)
  const altDirect = (alt as any)[key]

  return (nested ?? direct ?? altNested ?? altDirect ?? key) as string
}


