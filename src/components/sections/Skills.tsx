import React from "react";
import { Box, Text } from "ink";
import type { SkillGroup } from "../../app/resume.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";

interface SkillsProps {
  groups: SkillGroup[];
  columns: number;
}

export const Skills: React.FC<SkillsProps> = ({ groups }) => {
  return (
    <Box flexDirection="column">
      <SectionTitle index={3} title="Skills" />
      {groups.map((g) => (
        <Box key={g.name} flexDirection="column" marginBottom={1}>
          <Text bold color={theme.primary}>
            {`${icons.bullet} ${g.name}`}
          </Text>
          <Box flexDirection="row" flexWrap="wrap" marginLeft={2}>
            {g.keywords.map((k, i) => (
              <Box key={k} marginRight={1}>
                <Text color={theme.text}>{k}</Text>
                {i < g.keywords.length - 1 && (
                  <Text color={theme.muted}>{` ${icons.dot}`}</Text>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
