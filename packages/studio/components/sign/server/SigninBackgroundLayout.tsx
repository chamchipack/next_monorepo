import "../sign.module.css";
import ImageWrapper from "../lib/ImageWrapper";

const SigninBackgroundLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="responsive-layout">
      <div className="responsive-background">
        <div className="responsive-layout-image left-bottom">
          <ImageWrapper
            src="/image14.svg"
            altText="Background SVG"
            layout="fill"
            objectFit="contain"
            objectPosition="top right"
          />
        </div>

        <div className="responsive-layout-image right-top">
          <ImageWrapper
            src="/image17.svg"
            altText="Background SVG"
            layout="fill"
            objectFit="contain"
            objectPosition="bottom left"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SigninBackgroundLayout;
