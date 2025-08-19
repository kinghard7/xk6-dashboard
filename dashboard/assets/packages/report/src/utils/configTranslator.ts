// SPDX-FileCopyrightText: 2025 Contributors
// SPDX-License-Identifier: MIT

import { t } from "i18n"

// 配置文本翻译映射
const configTranslations: Record<string, string> = {
  // Tabs
  "Overview": "config.tabs.overview",
  "Timings": "config.tabs.timings", 
  "Summary": "config.tabs.summary",
  
  // Sections
  "HTTP": "config.sections.http",
  "gRPC": "config.sections.grpc",
  
  // Panels
  "Iteration Rate": "config.panels.iterationRate",
  "HTTP Request Rate": "config.panels.httpRequestRate",
  "HTTP Request Duration": "config.panels.httpRequestDuration",
  "HTTP Request Failed": "config.panels.httpRequestFailed",
  "Received Rate": "config.panels.receivedRate",
  "Sent Rate": "config.panels.sentRate",
  "HTTP Performance overview": "config.panels.httpPerformanceOverview",
  "VUs": "config.panels.vus",
  "Transfer Rate": "config.panels.transferRate",
  "Iteration Duration": "config.panels.iterationDuration",
  "Request Duration": "config.panels.requestDuration",
  "Request Failed Rate": "config.panels.requestFailedRate",
  "Request Connecting": "config.panels.requestConnecting",
  "Request Receiving": "config.panels.requestReceiving",
  "Request Blocked": "config.panels.requestBlocked",
  "Request Waiting": "config.panels.requestWaiting",
  "Request Rate": "config.panels.requestRate",
  "TLS handshaking": "config.panels.tlsHandshaking",
  "Request Sending": "config.panels.requestSending",
  "Streams Rate": "config.panels.streamsRate",
  "Trends": "config.panels.trends",
  "Counters": "config.panels.counters",
  "Rates": "config.panels.rates",
  "Gauges": "config.panels.gauges"
}

// 摘要文本翻译映射
const summaryTranslations: Record<string, string> = {
  // Tab摘要
  "This chapter provides an overview of the most important metrics of the test run. Graphs plot the value of metrics over time.": "config.summaries.overview",
  "This chapter provides an overview of test run HTTP timing metrics. Graphs plot the value of metrics over time.": "config.summaries.timings",
  "This chapter provides a summary of the test run metrics. The tables contains the aggregated values of the metrics for the entire test run.": "config.summaries.summary",
  
  // Section摘要
  "These metrics are generated only when the test makes HTTP requests.": "config.summaries.http",
  "k6 emits the following metrics when it interacts with a service through the gRPC API.": "config.summaries.grpc"
}

/**
 * 翻译配置文本
 * @param text 要翻译的文本
 * @returns 翻译后的文本
 */
export function translateConfig(text: string): string {
  const translationKey = configTranslations[text]
  if (translationKey) {
    return t(translationKey)
  }
  return text
}

/**
 * 翻译摘要文本
 * @param text 要翻译的摘要文本
 * @returns 翻译后的文本
 */
export function translateSummary(text: string): string {
  const translationKey = summaryTranslations[text]
  if (translationKey) {
    return t(translationKey)
  }
  return text
}

/**
 * 翻译面板标题
 * @param title 面板标题
 * @returns 翻译后的标题
 */
export function translatePanelTitle(title: string): string {
  return translateConfig(title)
}

/**
 * 翻译面板摘要
 * @param summary 面板摘要
 * @returns 翻译后的摘要
 */
export function translatePanelSummary(summary: string): string {
  return translateSummary(summary)
}
