/**
 * Remplaçant WEB d'expo-secure-store (aperçu de l'appli dans un navigateur).
 * Utilisé uniquement quand Metro bundle pour la plateforme « web » (voir
 * metro.config.js) ; sur téléphone, le vrai stockage chiffré est utilisé.
 * Ici la session est gardée dans le localStorage du navigateur de l'aperçu.
 */
const store = {
  get(key) { try { return window.localStorage.getItem(key) } catch { return null } },
  set(key, value) { try { window.localStorage.setItem(key, value) } catch {} },
  del(key) { try { window.localStorage.removeItem(key) } catch {} },
}

module.exports = {
  getItemAsync: async (key) => store.get(key),
  setItemAsync: async (key, value) => store.set(key, value),
  deleteItemAsync: async (key) => store.del(key),
  getItem: (key) => store.get(key),
  setItem: (key, value) => store.set(key, value),
  isAvailableAsync: async () => true,
  AFTER_FIRST_UNLOCK: 0,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 1,
  ALWAYS: 2,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 3,
  ALWAYS_THIS_DEVICE_ONLY: 4,
  WHEN_UNLOCKED: 5,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
}
