import sanitizeHtml from "sanitize-html";

import type {NativeProps} from "@/utils";

interface Props extends Omit<NativeProps<HTMLDivElement>, "children"> {
  children: string;
}

const Markup: React.FC<Props> = props => {
  const {children, ...nativeProps} = props;
  const sanitizedHtml = sanitizeHtml(children);
  return (
    <div {...nativeProps} dangerouslySetInnerHTML={{__html: sanitizedHtml}} />
  );
};

export default Markup;
