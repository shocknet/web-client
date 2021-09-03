import { supportedFormats } from "./Torrents";

export const getPostDescription = ({ contentItems, username }) =>
  contentItems
    .filter(item => item.type === "text/paragraph")
    .map(item => item.text)
    .join("\n") || `View ${username}'s posts on Lightning.Page`;

export const getMediaMetadata = contentItems => {
  return contentItems
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

      return {
        url: `${sanitizedUrl}/${type}-${index}.mp4`,
        thumbnail: `${sanitizedUrl}/${type}-${index}-thumb.png`,
        type
      };
    });
};
