import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MessageGroup {
  message: string | BotResponse[] | number,
  user: string
}

export interface BotResponse {
  Output : {
    RelevanceScore : string,
    FileName : string,
    Facts : string,
    CaseSummary : string
  }
}