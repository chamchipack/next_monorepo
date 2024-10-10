import Image from "next/image";

interface ImageWrapperProps
  extends Omit<React.ComponentProps<typeof Image>, "alt"> {
  altText: string;
}

const ImageWrapper = ({ altText, ...props }: ImageWrapperProps) => {
  return <Image alt={altText} {...props} />;
};

export default ImageWrapper;
