// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only

import React from "react"
import { Digest } from "@xk6-dashboard/model"

import "theme/global.css"
import { Flex } from "components/Flex"
import { ReactComponent as LogoIcon } from "assets/icons/logo.svg"

import { toDate } from "./Header.utils"
import * as styles from "./Header.css"
import { getLanguage, setLanguage, t } from "i18n"

interface HeaderProps {
  digest: Digest
}

export function Header({ digest }: HeaderProps) {
  const handleToggleLang = () => {
    const next = getLanguage() === "zh" ? "en" : "zh"
    setLanguage(next)
    const params = new URLSearchParams(window.location.search)
    params.set("lang", next)
    window.location.search = params.toString()
  }

  const label = getLanguage() === "zh" ? t("header.lang.en") : t("header.lang.zh")

  return (
    <Flex as="header" align="center">
      <LogoIcon />
      <Flex className={styles.heading} as="h1" grow={1} justify="center">
        {t("header.title")}: <span className={styles.date}>{toDate(digest.start)}</span>
      </Flex>
      <button className={styles.langSwitch} onClick={handleToggleLang} title={label}>{label}</button>
    </Flex>
  )
}
