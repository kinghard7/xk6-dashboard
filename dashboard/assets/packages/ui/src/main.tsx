// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only

import React from "react"
import ReactDOM from "react-dom/client"

import { DigestProvider } from "store/digest"
import { ThemeProvider } from "store/theme"
import { TimeRangeProvider } from "store/timeRange"
import { resolveInitialLanguage, setLanguage } from "i18n"

import App from "App"

const base = new URLSearchParams(window.location.search).get("endpoint") || "http://localhost:5665/"
const rootElement = document.getElementById("root") as HTMLDivElement

setLanguage(resolveInitialLanguage())
ReactDOM.createRoot(rootElement).render(
  <DigestProvider endpoint={base + "events"}>
    <ThemeProvider>
      <TimeRangeProvider>
        <App />
      </TimeRangeProvider>
    </ThemeProvider>
  </DigestProvider>
)
