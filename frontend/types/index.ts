import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Message {
  id: string,
  created_by: string,
  content_message: string,
  updated_at: Date;
}
