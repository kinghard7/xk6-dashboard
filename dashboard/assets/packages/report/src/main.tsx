// SPDX-FileCopyrightText: 2023 Iván Szkiba
// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-License-Identifier: MIT

import React from "react"
import { render } from "preact"
import "uplot/dist/uPlot.min.css"

import digest from "utils/digest"
import App from "App"
import { resolveInitialLanguage, setLanguage } from "i18n"

const rootElement = document.getElementById("root") as HTMLDivElement
// initialize language before render
setLanguage(resolveInitialLanguage())
digest().then((d) => render(<App digest={d} />, rootElement))
