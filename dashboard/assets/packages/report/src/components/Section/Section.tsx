// SPDX-FileCopyrightText: 2023 Raintank, Inc. dba Grafana Labs
//
// SPDX-License-Identifier: AGPL-3.0-only

import React from "react"
import { Digest } from "@xk6-dashboard/model"
import { Section as SectionClass } from "@xk6-dashboard/model"
import { PanelKind, isEmptySection } from "@xk6-dashboard/view"

import { Flex } from "components/Flex"
import { Grid } from "components/Grid"
import { Panel } from "components/Panel"
import { translateConfig, translateSummary } from "utils/configTranslator"

import { getColumnSizes } from "./Section.utils"
import * as styles from "./Section.css"
import { vars } from "theme"

interface SectionProps {
  section: SectionClass
  digest: Digest
}

export function Section({ section, digest }: SectionProps) {
  const isEmpty = isEmptySection(section, digest)
  const panelsExcludingStats = section.panels.filter((panel) => panel.kind !== PanelKind.stat)

  if (isEmpty || !panelsExcludingStats.length) {
    return null
  }

  return (
    <section>
      {section.title && (
        <Flex className={styles.header} align="baseline" gap={2}>
          <div className={styles.icon}>●</div>
          <Flex direction="column">
            <h3>{translateConfig(section.title)}</h3>
            <p>{translateSummary(section.summary)}</p>
          </Flex>
        </Flex>
      )}

      <div className={styles.panel}>
        <Grid key={section.id + "row"} gap={4}>
          {panelsExcludingStats.map((panel) => (
            <Grid.Column key={panel.id + "col"} {...getColumnSizes(panel, digest)}>
              <Panel key={panel.id} panel={panel} digest={digest} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    </section>
  )
}
