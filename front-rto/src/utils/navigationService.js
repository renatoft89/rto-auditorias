const navigationService = {
  navigate: (path) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
  },
};

export default navigationService;
