import React from "react";
import { Box, Text } from "ink";
import type { ProjectItem } from "../../app/resume.js";
import { RichText } from "../RichText.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";

interface ProjectsProps {
  items: ProjectItem[];
  columns: number;
}

export const Projects: React.FC<ProjectsProps> = ({ items }) => {
  return (
    <Box flexDirection="column">
      <SectionTitle index={4} title="Projects" />
      {items.map((p, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Box>
            <Text bold color={theme.text}>
              {p.name}
            </Text>
            <Text color={theme.muted}>{`  ${icons.dot}  `}</Text>
            <Text color={theme.muted}>{p.period}</Text>
          </Box>
          {p.website?.url ? (
            <Text color={theme.accent}>{p.website.url}</Text>
          ) : null}
          <Box marginTop={1}>
            <RichText html={p.description} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
