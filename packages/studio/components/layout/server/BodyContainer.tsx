import Sidebar from "@/components/layout/client/sidebar/Sidebar";
import NodeComponent from "@/components/layout/client/NodeComponent";

const BodyContainer = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <NodeComponent children={children} />
    </div>
  );
};

export default BodyContainer;
