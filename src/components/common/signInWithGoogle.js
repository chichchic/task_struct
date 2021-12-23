import firebase from "firebase";
import { useStore } from "vuex";
export default function signInWithGoogle() {
  const store = useStore();
  const $firestore = firebase.firestore();
  const $analytics = firebase.analytics();
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = "ko";
    store.commit("base/setLoading", true);
    try {
      const signInResult = await firebase.auth().signInWithPopup(provider);
      const providerData = signInResult.user.providerData[0];
      const { uid, email, displayName, phoneNumber, providerId } = providerData;
      const users = $firestore.collection("users");
      const doc = await users.doc(uid).get();
      if (!doc.exists) {
        await users.doc(uid).set({
          email,
          displayName,
          phoneNumber,
          providerId,
          createdAt: new Date(),
          doneCount: 0,
        });
        store.commit("user/setUserInfo", { ...providerData });
      } else {
        const userData = doc.data();
        store.commit("user/setUserInfo", { ...userData, uid });
      }
      $analytics.logEvent("signin");
    } catch (error) {
      console.error(error);
    } finally {
      store.commit("base/setLoading", false);
    }
  };
  const signOut = () => {
    try {
      firebase.auth().signOut();
      $analytics.logEvent("signout");
      store.commit("user/setUserInfo", null);
    } catch (error) {
      console.error(error);
    }
  };
  return {
    signIn,
    signOut,
  };
}
