// Conversation URL utilities removed - conversation feature has been removed

export const navigateToHome = (navigate?: (path: string) => void): void => {
  if (navigate) {
    navigate('/');
  } else {
    window.history.pushState({}, '', '/');
  }
};