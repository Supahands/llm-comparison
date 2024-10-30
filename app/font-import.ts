import { Lato, EB_Garamond } from "next/font/google";

export const lato = Lato({
  subsets: ["latin"],
  display: "auto",
  weight: ["400", "700", "900"],
});

export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "auto",
  weight: ["400", "700", "600"],
});
