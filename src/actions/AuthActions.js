import { Gun, createRandomGunUser, fetchPath } from "../utils/Gun";

export const ACTIONS = {
  LOAD_GUN_PAIR: "auth/loadPair"
};

export const generateGunPair = () => async dispatch => {
  console.log("[Gun] Checking if keypair exists...");
  const alias = localStorage.getItem("shocknet/gun/alias");
  const pass = localStorage.getItem("shocknet/gun/pass");
  const publicKey = localStorage.getItem("shocknet/gun/pub");
  const ePublicKey = localStorage.getItem("shocknet/gun/epub");

  if (!alias || !pass) {
    console.log("[Gun] Keypair not found, generating a new one...");
    const randomUser = await createRandomGunUser();
    console.log("Keypair generated!", randomUser);
    localStorage.setItem("shocknet/gun/alias", randomUser.alias);
    localStorage.setItem("shocknet/gun/pass", randomUser.pass);
    localStorage.setItem("shocknet/gun/pub", randomUser.pub);

    const gunPointer = Gun.user(randomUser.pub);
    const newUserEPublicKey = await fetchPath({
      path: "epub",
      gunPointer
    });
    localStorage.setItem("shocknet/gun/epub", newUserEPublicKey);
    dispatch({
      type: ACTIONS.LOAD_GUN_PAIR,
      data: randomUser
    });
    return;
  }

  console.log("[Gun] Keypair exists!");

  const user = {
    pub: publicKey,
    alias: alias,
    epub: ePublicKey,
    pass: pass
  };

  console.log("User Authenticated", JSON.stringify(user));

  dispatch({
    type: ACTIONS.LOAD_GUN_PAIR,
    data: user
  });

  return user;
};
