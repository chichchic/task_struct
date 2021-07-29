import firebase from 'firebase';
import store from '@/store/index.js';
export default function signInWithGoogle() {
  const $firestore = firebase.firestore();
  const signIn = async () => {
    store.commit('base/setLoading', true);
    try {
      const providerData = firebase.auth().currentUser.providerData[0];
      const { uid, email, displayName, phoneNumber, providerId } = providerData;
      const users = $firestore.collection('users');
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
        store.commit('user/setUserInfo', { ...providerData });
      } else {
        const userData = doc.data();
        store.commit('user/setUserInfo', { ...userData, uid });
      }
    } catch (error) {
      console.error(error);
    } finally {
      store.commit('base/setLoading', false);
    }
  };
  const signOut = () => {
    firebase.auth().signOut();
    store.commit('user/setUserInfo', null);
  };
  return {
    signIn,
    signOut,
  };
}
