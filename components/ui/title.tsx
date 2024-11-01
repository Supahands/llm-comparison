import { ebGaramond } from "@/app/font-import";
import { ReactNode } from "react";

type TitleProps = {
	children: ReactNode
}

export default function Title({ children }: TitleProps) {
  return (
    <h1
      className={`text-2xl ${ebGaramond.className} font-semibold text-llm-grey1 leading-[150%]`}
    >
      {children}
    </h1>
  );
}
