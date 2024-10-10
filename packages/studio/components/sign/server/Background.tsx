import "../sign.module.css";

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
      {children}
    </div>
  );
};

export default Main;
