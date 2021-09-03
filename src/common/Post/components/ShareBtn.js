import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import CopyClipboard from "react-copy-to-clipboard";
import { getMediaMetadata, getPostDescription } from "../../../utils/Post";

const ShareBtn = ({ publicKey, id, username, pinned, contentItems = [] }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const url = useMemo(() => {
    const media = getMediaMetadata(contentItems);
    const description = getPostDescription({
      contentItems,
      username
    });
    const link = `https://${window.location.host}/${publicKey}/post/${id}`;

    const metadata = {
      title: `Post by ${username}`,
      url: link,
      type: `website`,
      media,
      description
    };

    const metadataBase64 = btoa(
      unescape(encodeURIComponent(JSON.stringify(metadata)))
    );
    const shareLink = `${link}?metadata=${metadataBase64}`;

    return shareLink;
  }, [contentItems, username, publicKey, id]);

  const sharePost = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        text: `Check out ${username}'s post on Lightning.Page!`,
        url
      });
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
