import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import CopyClipboard from "react-copy-to-clipboard";
import { supportedFormats } from "../../../utils/Torrents";

const ShareBtn = ({ publicKey, id, username, pinned, contentItems = [] }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const url = useMemo(() => {
    const media = contentItems
      .filter(item => ["image/embedded", "video/embedded"].includes(item.type))
      .map((item, index) => {
        const file = item.magnetURI.replace(/.*(ws=)/gi, "");
        const type = item.type.replace("/embedded", "");
        const [compatibleURL] = supportedFormats.filter(format =>
          file.toLowerCase().endsWith(`.${format.toLowerCase()}`)
        );

        if (compatibleURL) {
          return {
            url: compatibleURL,
            type
          };
        }

        const [, url] =
          item.magnetURI.match(/(?:magnet:\?xs=)([\w\d].*torrent)/i) ?? [];
        const sanitizedUrl = decodeURIComponent(url ?? "").replace(
          /\/[\w\d]+.torrent/gi,
          ""
        );

        console.log("Sanitized URL:", url, sanitizedUrl);

        return {
          url: `${sanitizedUrl}/${type}-${index}.mp4`,
          thumbnail: `${sanitizedUrl}/${type}-${index}-thumb.png`,
          type
        };
      });

    const description =
      contentItems
        .filter(item => item.type === "text/paragraph")
        .map(item => item.text)
        .join("\n") || `View ${username}'s posts on ShockWallet`;

    const metadata = {
      title: `Post by ${username}`,
      url: `https://${window.location.host}/${publicKey}/post/${id}`,
      type: `website`,
      media,
      description
    };

    const metadataBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(metadata))));
    const shareLink = `https://${window.location.host}/${publicKey}/post/${id}?metadata=${metadataBase64}`;

    return shareLink;
  }, [contentItems, username, publicKey, id]);

  const sharePost = useCallback(async () => {
    if (navigator.share) {
      navigator.share({
        text: `Check out this post from ${username} on ShockWallet!`,
        url
      });
      return;
    }
  }, [username, url]);

  const onCopy = useCallback(() => {
    setCopiedLink(true);
  }, []);

  const getShareMessage = useCallback(
    () => (copiedLink ? "Post link copied!" : "Share this post"),
    [copiedLink]
  );

  useEffect(() => {
    ReactTooltip.rebuild();
    const timeout = setTimeout(() => {
      setCopiedLink(false);
      ReactTooltip.rebuild();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copiedLink]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  if (!navigator.share) {
    const tooltipId = `share-${publicKey}-${pinned ? "pinned" : ""}-${id}`;
    return (
      <CopyClipboard text={url} onCopy={onCopy}>
        <div className="share-btn-container">
          <div
            className="share-btn"
            data-tip={getShareMessage()}
            data-for={tooltipId}
          >
            <i className="fas fa-external-link-alt"></i>
          </div>
          <ReactTooltip
            effect="solid"
            backgroundColor="#3a4d67"
            getContent={[getShareMessage, 30]}
            id={tooltipId}
          />
        </div>
      </CopyClipboard>
    );
  }

  return (
    <div className="share-btn" onClick={sharePost}>
      <i className="fas fa-external-link-alt"></i>
    </div>
  );
};

export default ShareBtn;
