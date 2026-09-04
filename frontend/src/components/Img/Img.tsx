import {useEffect, useState} from "react";
import {twJoin} from "tailwind-merge";

export interface ImgProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    "src"
  > {
  placeholder?: JSX.Element;
  src: string;
  alt: string;
  size: "sm" | "lg";
}

const Img: React.FC<ImgProps> = props => {
  const {size, src, ...imgProps} = props;

  const sizeTw = {
    sm: 10,
    lg: 12,
  }[size];
  const [imgStatus, setImgStatus] = useState<null | "loaded" | "failed">(null);

  useEffect(() => setImgStatus(null), [src]);

  if (imgStatus === "failed") {
    if (props.placeholder) {
      return props.placeholder;
    }

    return (
      <div
        className={twJoin(
          `size-${sizeTw} rounded-4 bg-grey-200 dark:bg-dark-surface`,
          imgProps.className,
        )}
      />
    );
  }

  return (
    <img
      {...imgProps}
      src={src}
      onLoad={() => setImgStatus("loaded")}
      onError={() => setImgStatus("failed")}
      className={twJoin(`size-${sizeTw}`, imgProps.className)}
    />
  );
};

export default Img;
