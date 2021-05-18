import React, { Suspense, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../actions/TipActions";
import Loader from "../Loader";
import "./css/index.css";

const TipModalContent = React.lazy(() => import("./components/Modal"));

const TipModal = props => {
  const dispatch = useDispatch();
  const modalOpen = useSelector(({ tip }) => tip.modalOpen);

  const close = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const loader = useMemo(() => <Loader text="Loading..." />, []);

  if (!modalOpen) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={close}></div>
      <div className="modal-content">
        <Suspense fallback={loader}>
          <TipModalContent {...props} />
        </Suspense>
      </div>
    </div>
  );
};

export default TipModal;
