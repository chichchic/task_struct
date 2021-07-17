import firebase from 'firebase';
import { useStore } from 'vuex';
export default function signInWithGoogle() {
  const store = useStore();
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = 'ko';
    store.commit('base/setLoading', true);
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    } finally {
      store.commit('base/setLoading', false);
    }
  };
  const signOut = () => {
    firebase.auth().signOut();
  };
  return {
    signIn,
    signOut,
  };
}
