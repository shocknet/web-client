import SEA from "gun/sea";
import { Gun, fetchPath, setPath, authUser } from "../utils/Gun";

export const ACTIONS = {
  LOAD_PAYMENT_REQUEST: "paymentRequest/load"
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

  const order = {
    amount: await SEA.encrypt(amount.toString(), secret),
    from: me.sea.pub,
    memo: await SEA.encrypt("Tipped user!", secret),
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

  const encryptedOrder = await fetchPath({
    path: `orderToResponse/${newOrderId}`,
    gunPointer: Gun.user(recipientPublicKey),
    method: "on"
  });

  const decryptedOrder = {
    response: await SEA.decrypt(encryptedOrder.response, secret),
    type: encryptedOrder.type
  };

  console.log("[ORDER] Decrypted order:", decryptedOrder);

  if (decryptedOrder.type === "err") {
    throw {
      field: "order",
      message: "An error has occurred while retrieving the order",
      data: decryptedOrder.response
    };
  }

  dispatch({
    type: ACTIONS.LOAD_PAYMENT_REQUEST,
    data: decryptedOrder.response
  });

  return decryptedOrder.response;
};
