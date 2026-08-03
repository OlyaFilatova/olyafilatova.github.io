export function notifySidePanel(action: string, payload: Record<string, any>) {
  chrome.runtime.sendMessage({ action, payload }).catch((err) => {
    console.log('Side panel not open or ready yet.', err);
  });
}
