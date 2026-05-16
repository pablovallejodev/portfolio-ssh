import React from "react";
import { Box, Text } from "ink";
import type { Basics } from "../../app/resume.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";
import { project } from "../../app/project.js";

interface ContactProps {
  basics: Basics;
  columns: number;
}

interface Row {
  label: string;
  value: string;
  isLink?: boolean;
}

const Line: React.FC<{ row: Row }> = ({ row }) => (
  <Box flexDirection="row">
    <Box width={14}>
      <Text color={theme.primary} bold>
        {`${icons.bullet} ${row.label}`}
      </Text>
    </Box>
    <Text color={row.isLink ? theme.accent : theme.text}>{row.value}</Text>
  </Box>
);

export const Contact: React.FC<ContactProps> = ({ basics }) => {
  const rows: Row[] = [
    { label: "Email", value: basics.email, isLink: true },
    { label: "Location", value: basics.location },
  ];
  for (const f of basics.customFields) {
    if (f.icon === "linkedin") {
      rows.push({
        label: "LinkedIn",
        value: f.link || `https://linkedin.com/in/${f.text}/`,
        isLink: true,
      });
    } else if (f.icon === "id") {
      rows.push({ label: "Status", value: f.text });
    } else if (f.link) {
      rows.push({ label: "Info", value: f.link, isLink: true });
    } else {
      rows.push({ label: "Info", value: f.text });
    }
  }
  // The web portfolio is a sibling project (different repo). We show it as a
  // separate row so it's not confused with the source of this SSH app below.
  rows.push({
    label: "Web portfolio",
    value: project.web.url,
    isLink: true,
  });
  rows.push({
    label: "SSH source",
    value: project.ssh.repo,
    isLink: true,
  });

  return (
    <Box flexDirection="column">
      <SectionTitle index={6} title="Contact" />
      {rows.map((r) => (
        <Line key={r.label + r.value} row={r} />
      ))}
      <Box marginTop={1} flexDirection="column">
        <Text color={theme.muted}>
          This SSH portfolio is open source under the{" "}
          <Text color={theme.primary} bold>
            {project.ssh.license}
          </Text>{" "}
          license — feel free to fork it and make it your own.
        </Text>
      </Box>
    </Box>
  );
};
