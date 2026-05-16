import React from "react";
import { Box, Text } from "ink";
import { theme } from "../app/theme.js";

export type SectionId =
  | "welcome"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "languages"
  | "contact";

interface Entry {
  id: SectionId;
  key: string;
  label: string;
}

export const sections: Entry[] = [
  { id: "about", key: "1", label: "About" },
  { id: "experience", key: "2", label: "Experience" },
  { id: "skills", key: "3", label: "Skills" },
  { id: "projects", key: "4", label: "Projects" },
  { id: "languages", key: "5", label: "Languages" },
  { id: "contact", key: "6", label: "Contact" },
];

interface MenuProps {
  active: SectionId;
  columns: number;
}

export const Menu: React.FC<MenuProps> = ({ active, columns }) => {
  return (
    // Full-width row that centres its content horizontally so the navbar
    // sits in the middle of the terminal regardless of its size.
    <Box width={columns} justifyContent="center" marginTop={0}>
      <Box flexDirection="row">
        {sections.map((s, idx) => {
          const isActive = s.id === active;
          return (
            <Box key={s.id} marginLeft={idx > 0 ? 1 : 0}>
              {isActive ? (
                // Active pill: cyan background with pure-white text. We use a
                // 24-bit hex colour (`#ffffff`) rather than an ANSI named
                // colour so it ignores the terminal's palette — some themes
                // remap `white` / `whiteBright` to off-white or cyan, which
                // would make the letters look transparent against the cyan
                // background.
                <Text color="#ffffff" backgroundColor={theme.primary}>
                  {` ${s.key} ${s.label} `}
                </Text>
              ) : (
                // Inactive pill: the key number stays in the accent colour
                // (so the navigation hint is always visible) and the label
                // sits in a softer neutral tone.
                <Text>
                  <Text bold color={theme.primary}>
                    {` ${s.key} `}
                  </Text>
                  <Text color={theme.muted}>{`${s.label} `}</Text>
                </Text>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
