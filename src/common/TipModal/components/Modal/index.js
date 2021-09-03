import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CopyClipboard from "react-copy-to-clipboard";
import Tooltip from "react-tooltip";
import QRCode from "react-qr-code";
import { payUser, closeModal } from "../../../../actions/TipActions";
import { generateGunPair } from "../../../../actions/AuthActions";
import Loader from "../../../Loader";
import "./css/index.css";
import { fetchPath } from "../../../../utils/Gun";
import { Gun } from "../../../../utils/Gun";

const TipModalContent = ({ publicKey }) => {
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.pair);
  const paymentRequest = useSelector(({ tip }) => tip.paymentRequest);
  const metadata = useSelector(({ tip }) => tip.metadata);

  const [tipLoading, setTipLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [ackNode, setAckNode] = useState("");
  const [done, setDone] = useState(false);

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
      const { ackNode } = await dispatch(
        payUser({
          senderPair: me,
          recipientPublicKey: publicKey,
          amount: tipAmount,
          metadata: metadata
        })
      );
      setTipLoading(false);
      if (ackNode) {
        setAckNode(ackNode);
      }
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, setAckNode, me, metadata, publicKey, tipAmount]);

  useEffect(() => {
    if (!ackNode) {
      return;
    }
    fetchPath({
      path: `orderToResponse/${ackNode}`,
      gunPointer: Gun.user(publicKey),
      method: "on"
    })
      .then(() =>
        fetchPath({
          path: `orderToResponse/${ackNode}`,
          gunPointer: Gun.user(publicKey)
        })
      )
      .then(res => {
        if (res.type === "orderAck") {
          setDone(true);
        }
      });
  }, [ackNode, publicKey, setDone]);

  const closeTipModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    dispatch(generateGunPair());
  }, [dispatch]);

  let step = "";
  if (paymentRequest) step = "paymentRequest";
  if (done) step = "done";
  return (
    <div className="tip-modal">
      {tipLoading ? (
        <div className="tip-modal-loading">
          <Loader text="Submitting Tip Request..." />
        </div>
      ) : null}
      <div className="tip-modal-head">
        <div className="tip-modal-title">Send Tip</div>
      </div>
      {step === "" && (
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
      {step === "paymentRequest" && (
        <div className="tip-modal-content">
          <p className="tip-modal-instructions">
            We've successfully generated an invoice for you to tip, please scan
            the QR Code below using a Lightning wallet to pay it!
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
      )}
      {step === "done" && (
        <div className="tip-modal-footer" onClick={closeTipModal}>
          <div className="tip-modal-submit">TIP SENT!</div>
        </div>
      )}
      {step === "" && (
        <div className="tip-modal-footer" onClick={sendTip}>
          <div className="tip-modal-submit">SEND TIP</div>
        </div>
      )}
    </div>
  );
};

export default TipModalContent;
