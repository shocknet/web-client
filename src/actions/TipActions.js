import SEA from "gun/sea";
import {
  Gun,
  fetchPath,
  setPath,
  authUser,
  $$__SHOCKWALLET__MSG__,
  $$_SHOCKWALLET__ENCRYPTED__
} from "../utils/Gun";

export const ACTIONS = {
  LOAD_PAYMENT_REQUEST: "tip/paymentRequest/load",
  RESET_PAYMENT_REQUEST: "tip/paymentRequest/reset",
  OPEN_TIP_MODAL: "tip/modal/open",
  CLOSE_TIP_MODAL: "tip/modal/close",
  UPDATE_METADATA: "tip/metadata/update"
};

export const openModal = metadata => ({
  type: ACTIONS.OPEN_TIP_MODAL,
  data: metadata
});

export const closeModal = () => ({
  type: ACTIONS.CLOSE_TIP_MODAL
});

export const updateMetadata = metadata => ({
  type: ACTIONS.UPDATE_METADATA,
  data: metadata
});

export const payUser =
  ({ senderPair, recipientPublicKey, amount, metadata }) =>
  async dispatch => {
    const me = await authUser(senderPair.alias, senderPair.pass);
    const recipientUser = Gun.user(recipientPublicKey);
    const [recipientUserEPub, orderAddress] = await Promise.all([
      fetchPath({
        path: "epub",
        gunPointer: recipientUser
      }),
      fetchPath({
        path: "currentOrderAddress",
        gunPointer: recipientUser
      })
    ]);

    const secret = await SEA.secret(recipientUserEPub, me.sea);

    console.log("Order Address:", orderAddress);

    const [encryptedAmount, encryptedMemo] = await Promise.all([
      SEA.encrypt($$__SHOCKWALLET__MSG__ + amount.toString(), secret),
      SEA.encrypt($$__SHOCKWALLET__MSG__ + "Tipped user!", secret)
    ]);

    const order = {
      amount: $$_SHOCKWALLET__ENCRYPTED__ + encryptedAmount,
      from: me.sea.pub,
      memo: $$_SHOCKWALLET__ENCRYPTED__ + encryptedMemo,
      timestamp: Date.now(),
      // Tip type
      ...metadata
    };

    console.log("Order:", order);

    const newOrder = await setPath({
      path: `orderNodes/${orderAddress}`,
      data: order
    });
    console.log(
      "New Order:",
      newOrder,
      newOrder._["#"].split("/").slice(-1)[0]
    );

    const newOrderId = newOrder._["#"].split("/").slice(-1)[0];

    console.log("New Order ID:", newOrderId, `orderToResponse/${newOrderId}`);

    await fetchPath({
      path: `orderToResponse/${newOrderId}`,
      gunPointer: Gun.user(recipientPublicKey),
      method: "on"
    });
    const encryptedOrder = await fetchPath({
      path: `orderToResponse/${newOrderId}`,
      gunPointer: Gun.user(recipientPublicKey)
    });

    console.log(
      "Encrypted Order:",
      encryptedOrder.response,
      encryptedOrder.response?.toString()
    );

    const decryptedResponse = await SEA.decrypt(
      encryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, ""),
      secret
    );

    const decryptedOrder = {
      response: decryptedResponse?.replace?.($$__SHOCKWALLET__MSG__, ""),
      type: encryptedOrder.type
    };

    console.log("[ORDER] Decrypted order:", decryptedOrder);

    if (decryptedOrder.type === "err") {
      throw {
        field: "order",
        message: "An error has occurred while retrieving the order",
        data: decryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, "")
      };
    }

    dispatch({
      type: ACTIONS.LOAD_PAYMENT_REQUEST,
      data: decryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, "")
    });

    return {
      paymentRequest: decryptedOrder.response.replace(
        $$_SHOCKWALLET__ENCRYPTED__,
        ""
      ),
      ackNode: encryptedOrder.ackNode
    };
  };

export const resetPaymentRequest = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_PAYMENT_REQUEST
  });
};
