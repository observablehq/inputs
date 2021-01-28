export function disposal(element) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const target = element.closest(".observablehq");
      if (!target) return resolve();
      const observer = new MutationObserver(() => {
        if (target.contains(element)) return;
        observer.disconnect(), resolve();
      });
      observer.observe(target, {childList: true});
    });
  });
}
