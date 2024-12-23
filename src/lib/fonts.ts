import {
  Lora,
  Merriweather,
  Playfair_Display,
  Roboto_Slab,
  Quicksand,
} from "next/font/google";

export const fontLora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--lora",
});

export const fontMerriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--merriweather",
});

export const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--playfair-display",
});

export const fontRobotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--roboto-slab",
});

export const fontQuicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--quicksand",
});
