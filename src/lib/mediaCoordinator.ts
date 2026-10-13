// One Bunny content video plays at a time across the whole page.
export type MediaOwner = "hero" | "work";
const EVENT = "nerdbatch:media-claim";

export const claimPlayback = (owner: MediaOwner) =>
  window.dispatchEvent(new CustomEvent<MediaOwner>(EVENT, { detail: owner }));

/** Calls `onYield` whenever another owner starts playing. */
export const onOtherClaim = (owner: MediaOwner, onYield: () => void) => {
  const handler = (e: Event) => {
    if ((e as CustomEvent<MediaOwner>).detail !== owner) onYield();
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};
