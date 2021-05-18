import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CopyClipboard from "react-copy-to-clipboard";
import Tooltip from "react-tooltip";
import QRCode from "react-qr-code";
import { closeModal, payUser } from "../../actions/TipActions";
import { generateGunPair } from "../../actions/AuthActions";
import Loader from "../Loader";
import "./css/index.css";

const TipModalContent = ({ publicKey }) => {
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.pair);
  const paymentRequest = useSelector(({ tip }) => tip.paymentRequest);
  const modalOpen = useSelector(({ tip }) => tip.modalOpen);
  const metadata = useSelector(({ tip }) => tip.metadata);

  const [tipLoading, setTipLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const setCopiedStatus = useCallback(() => {
    setCopied(true);
    Tooltip.rebuild();
    const timer = setTimeout(() => {
      setCopied(false);
      Tooltip.rebuild();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const sendTip = useCallback(async () => {
    try {
      setTipLoading(true);
      await dispatch(
        payUser({
          senderPair: me,
          recipientPublicKey: publicKey,
          amount: tipAmount,
          metadata: metadata
        })
      );
      setTipLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, me, metadata, publicKey, tipAmount]);

  useEffect(() => {
    dispatch(generateGunPair());
  }, [dispatch]);

  if (!modalOpen) {
    return null;
  }

  return (
    <div className="tip-modal-container">
      <div className="tip-modal-overlay" onClick={close}></div>
      <div className="tip-modal">
        {tipLoading ? (
          <div className="tip-modal-loading">
            <Loader text="Submitting Tip Request..." />
          </div>
        ) : null}
        <div className="tip-modal-head">
          <div className="tip-modal-title">Send Tip</div>
        </div>
        {paymentRequest ? (
          <div className="tip-modal-content">
            <p className="tip-modal-instructions">
              We've successfully generated an invoice for you to tip, please
              scan the QR Code below using a Lightning wallet to pay it!
            </p>
            <div className="tip-modal-qr-code-container">
              <QRCode
                className="tip-modal-qr-code"
                value={paymentRequest}
                size={210}
                bgColor="#4db1ff"
                fgColor="#1b2129"
              />
            </div>
            <div className="tip-modal-action-btns">
              <a
                href={`lightning:${paymentRequest}`}
                className="tip-modal-action-btn"
              >
                PAY INVOICE
              </a>
              <CopyClipboard text={paymentRequest} onCopy={setCopiedStatus}>
                <div className="tip-modal-action-btn">
                  {copied ? "INVOICE COPIED!" : "COPY INVOICE"}
                </div>
              </CopyClipboard>
            </div>
          </div>
        ) : (
          <div className="tip-modal-content">
            <p className="tip-modal-instructions">
              Please specify the amount of sats you'd like to tip this user with
              below and we'll generate an invoice for you to scan.
            </p>
            <input
              className="tip-modal-input"
              value={tipAmount}
              onChange={e => setTipAmount(e.target.value)}
            />
          </div>
        )}
        {!paymentRequest ? (
          <div className="tip-modal-footer" onClick={sendTip}>
            <div className="tip-modal-submit">SEND TIP</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TipModalContent;
