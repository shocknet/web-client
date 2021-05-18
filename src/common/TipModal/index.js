import React, { Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import Loader from "../Loader";

const TipModalContent = React.lazy(() => import("./Modal"));

const TipModal = props => {
  const modalOpen = useSelector(({ tip }) => tip.modalOpen);

  const loader = useMemo(
    () => (
      <div className="tip-modal">
        <div className="tip-modal-content">
          <Loader text="Loading..." />
        </div>
      </div>
    ),
    []
  );

  if (!modalOpen) {
    return null;
  }

  return (
    <Suspense fallback={loader}>
      <TipModalContent {...props} />
    </Suspense>
  );
};

export default TipModal;
