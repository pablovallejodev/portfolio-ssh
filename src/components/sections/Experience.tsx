import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { ExperienceItem } from "../../app/resume.js";
import { RichText } from "../RichText.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";

interface ExperienceProps {
  items: ExperienceItem[];
  columns: number;
}

export const Experience: React.FC<ExperienceProps> = ({ items }) => {
  const [index, setIndex] = useState(0);
  const total = items.length;

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setIndex((i) => (i - 1 + total) % total);
    } else if (key.downArrow || input === "j") {
      setIndex((i) => (i + 1) % total);
    }
  });

  const current = items[index];
  if (!current) return null;

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <SectionTitle index={2} title="Experience" />
        <Text color={theme.muted}>
          {`${index + 1}/${total}  `}
          <Text color={theme.accent}>↑/↓</Text>
          {` switch`}
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text bold color={theme.text}>
            {current.position}
          </Text>
          <Text color={theme.muted}>{`  ${icons.separator}  `}</Text>
          <Text color={theme.primary} bold>
            {current.company}
          </Text>
        </Box>
        <Box>
          <Text color={theme.muted}>{current.period}</Text>
          <Text color={theme.muted}>{`  ${icons.dot}  `}</Text>
          <Text color={theme.muted}>{current.location}</Text>
          {current.website?.url ? (
            <>
              <Text color={theme.muted}>{`  ${icons.dot}  `}</Text>
              <Text color={theme.accent}>{current.website.url}</Text>
            </>
          ) : null}
        </Box>
      </Box>

      <RichText html={current.description} />

      <Box marginTop={1} flexDirection="row">
        {items.map((_, i) => (
          <Text key={i} color={i === index ? theme.primary : theme.muted}>
            {i === index ? "●" : "○"}{" "}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
