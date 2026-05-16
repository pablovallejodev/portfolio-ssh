import type figlet from "figlet";
import { theme } from "./theme.js";

export interface BannerStyle {
  text: string;
  fonts: figlet.Fonts[];
  colors: string[];
  backgroundColor?: string;
  bold: boolean;
  border?: boolean;
  borderColor?: string;
  paddingY?: number;
  fullWidth?: boolean;
}

export const bannerStyle: BannerStyle = {
  text:            "PABLO VALLEJO",
  fonts:           ["ANSI Shadow", "Doom", "Big", "Slant", "Standard", "Small", "Mini"],
  colors:          ["#ffffff"],
  backgroundColor: theme.primary,
  bold:            true,
  border:          true,
  borderColor:     theme.primary,
  paddingY:        1,
  fullWidth:       true,
};
