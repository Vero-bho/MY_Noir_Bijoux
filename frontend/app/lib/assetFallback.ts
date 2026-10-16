import type { SyntheticEvent } from "react";

export function handleAssetError(
  event: SyntheticEvent<HTMLImageElement, Event>,
  _requestedPath?: string,
) {
  const image = event.currentTarget;
  image.dataset.assetError = "true";
  image.style.visibility = "hidden";
}
