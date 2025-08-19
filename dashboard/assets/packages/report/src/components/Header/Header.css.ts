// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only

import { style } from "@vanilla-extract/css"
import { vars } from "theme"

export const heading = style({
  fontSize: vars.fontSizes.sizeFluid
})

export const date = style({
  color: vars.colors.text.secondary
})

export const langSwitch = style({
  border: `1px solid ${vars.colors.text.disabled}`,
  color: vars.colors.text.secondary,
  background: "transparent",
  padding: `${vars.sizes.size1} ${vars.sizes.size3}`,
  borderRadius: "9999px",
  cursor: "pointer",
  fontSize: vars.fontSizes.size2,
  transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  selectors: {
    '&:hover': {
      background: vars.colors.primary.light,
      color: vars.colors.text.primary,
      borderColor: vars.colors.text.hover
    }
  }
})
