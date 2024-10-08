import { useState, useEffect } from "react";

const useRenderStatus = () => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return isRendered;
};

export default useRenderStatus;
