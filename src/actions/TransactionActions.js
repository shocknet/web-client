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
  LOAD_PAYMENT_REQUEST: "paymentRequest/load",
  RESET_PAYMENT_REQUEST: "paymentRequest/reset"
};

export const payUser = (
  senderPair,
  recipientPublicKey,
  amount
) => async dispatch => {
  const me = await authUser(senderPair.alias, senderPair.pass);
  const recipientUser = Gun.user(recipientPublicKey);
  const recipientUserEPub = await fetchPath({
    path: "epub",
    gunPointer: recipientUser
  });
  console.log("Recipient EPub:");

  const secret = await SEA.secret(recipientUserEPub, me.sea);

  const orderAddress = await fetchPath({
    path: "currentOrderAddress",
    gunPointer: recipientUser
  });

  console.log("Order Address:", orderAddress);

  const [encryptedAmount, encryptedMemo] = await Promise.all([
    SEA.encrypt($$__SHOCKWALLET__MSG__ + amount.toString(), secret),
    SEA.encrypt($$__SHOCKWALLET__MSG__ + "Tipped user!", secret)
  ]);

  const order = {
    amount: $$_SHOCKWALLET__ENCRYPTED__ + encryptedAmount,
    from: me.sea.pub,
    memo: $$_SHOCKWALLET__ENCRYPTED__ + encryptedMemo,
    timestamp: Date.now()
  };

  console.log("Order:", order);

  const newOrder = await setPath({
    path: `orderNodes/${orderAddress}`,
    data: order
  });
  console.log("New Order:", newOrder, newOrder._["#"].split("/").slice(-1)[0]);

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

  const decryptedOrder = {
    response: await SEA.decrypt(
      encryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, ""),
      secret
    ),
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

  return decryptedOrder.response.replace($$_SHOCKWALLET__ENCRYPTED__, "");
};

export const resetPaymentRequest = () => dispatch => {
  dispatch({
    type: ACTIONS.RESET_PAYMENT_REQUEST
  });
};
