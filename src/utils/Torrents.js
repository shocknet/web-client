import { getCachedFile, renderCachedFile, saveFile } from "./Cache";
import { runSerial } from "./Promise";

export const supportedFileTypes = {
  "video/embedded": {
    formats: ["mp4", "webm"],
    element: "video",
    options: {
      autoplay: true,
      muted: true
    }
  },
  "image/embedded": {
    formats: ["jpg", "png", "webp", "jpeg"],
    element: "img",
    options: {}
  }
};

export const supportedFormats = Object.values(supportedFileTypes).reduce(
  (supportedFormats, fileType) => [...supportedFormats, ...fileType.formats],
  []
);

const _getFileType = file => {
  const extension = file.name?.split(".")?.slice(-1)[0];
  const [supportedFileType] = Object.entries(supportedFileTypes).filter(
    ([type, options]) => options.formats.includes(extension)
  );

  if (supportedFileType) {
    const [name, fileType] = supportedFileType;
    return {
      name,
      ...fileType
    };
  }

  return null;
};

export let webTorrentClient = null;

export const initializeClient = async () => {
  if (!webTorrentClient) {
    const WebTorrent = await import("webtorrent");
    webTorrentClient = new WebTorrent.default();
  }

  return webTorrentClient;
};

const getCacheId =
  ({ id, key }) =>
  file =>
    `${id}-${key}-${file.name}`;

const renderTorrent = ({ file, type, torrentMode, torrent }) => {
  const element = type.element;
  const target = `${element}[data-torrent="${torrent.magnetURI}"]`;
  const torrentElements = document.querySelectorAll(target);
  console.log("Torrent Elements:", torrentElements);
  torrentElements.forEach(torrentElement => {
    const contentURL = decodeURIComponent(
      torrent.magnetURI.replace(/.*(ws=)/gi, "")
    );
    const [compatibleURL] = type.formats.filter(format =>
      contentURL.toLowerCase().endsWith(`.${format.toLowerCase()}`)
    );

    if (torrentMode || !compatibleURL) {
      file.renderTo(torrentElement, type.options);
      return;
    }

    torrentElement.setAttribute("src", contentURL);
  });
};

export const attachMedia = async (posts = [], torrentMode = true) => {
  const torrentTasks = await Promise.all(
    posts.map(async post => {
      const { contentItems, id } = post;
      const supportedItems = Object.entries(contentItems).filter(
        ([, item]) => supportedFileTypes[item.type]
      );

      if (!supportedItems) {
        return [];
      }

      const webTorrentClient = await initializeClient();

      return supportedItems.map(
        ([key, item]) =>
          () =>
            new Promise(resolve => {
              const getCacheFileName = getCacheId({ id, key });
              const torrentExists = webTorrentClient.get(item.magnetURI);

              if (torrentExists) {
                resolve(true);
                return;
              }

              webTorrentClient.add(item.magnetURI, async torrent => {
                // Proceed to the next torrent in queue
                resolve(true);

                const files = torrent.files.filter(file => {
                  const extension = file.name?.split(".")?.slice(-1)[0];
                  const supportedFileType = Object.entries(
                    supportedFileTypes
                  ).filter(([, options]) =>
                    options.formats.includes(extension)
                  )[0];
                  if (supportedFileType) {
                    const [, fileType] = supportedFileType;
                    const matched = fileType.formats.includes(extension);
                    return matched;
                  }
                  return false;
                });

                const thumbnails = files.filter(file =>
                  file.name.match(/-thumb\.([\w\d]){2,4}$/gi)
                );
                const thumbnailFileNames = thumbnails.map(file =>
                  file.name.replace(/\.([\w\d]){2,4}$/gi, "")
                );

                files.map(async file => {
                  // Skip thumbnails
                  if (thumbnailFileNames.includes(file.name)) {
                    return;
                  }

                  const fileType = _getFileType(file);

                  if (!fileType) {
                    return;
                  }

                  const fileName = getCacheFileName(file);

                  const element = fileType.element;
                  const target = `${element}[data-torrent="${item.magnetURI}"]`;
                  const cachedFile = await getCachedFile(fileName);
                  // Find thumbnail
                  const sanitizedName = fileName
                    .split(".")
                    .slice(0, -1)
                    .join(".");
                  const thumbnailName = `${sanitizedName}-thumb`;
                  const thumbnailIndex =
                    thumbnailFileNames.indexOf(thumbnailName);
                  const thumbnailFile = thumbnails[thumbnailIndex];
                  const thumbnailFileType = thumbnailFile
                    ? _getFileType(thumbnailFile)
                    : null;

                  if (cachedFile) {
                    const torrent = webTorrentClient.get(item.magnetURI);

                    if (torrent) {
                      torrent.destroy();
                    }

                    if (element === "video" && thumbnailFile) {
                      const target = `${thumbnailFileType.element}[data-torrent="${item.magnetURI}"]`;
                      const cachedThumbnail = await getCachedFile(
                        getCacheFileName(thumbnailFile)
                      );

                      renderCachedFile(cachedThumbnail, target);
                    }

                    renderCachedFile(cachedFile, target);
                    return;
                  }

                  renderTorrent({
                    file,
                    type: fileType,
                    torrentMode,
                    torrent: item
                  });

                  if (thumbnailFile) {
                    renderTorrent({
                      file: thumbnailFile,
                      type: thumbnailFileType,
                      torrentMode,
                      torrent: item
                    });
                  }
                });

                torrent.on("done", () => {
                  files.map(file => {
                    const fileType = _getFileType(file);
                    const fileName = getCacheFileName(file);
                    const element = fileType.element;
                    const target = `${element}[data-torrent="${item.magnetURI}"]`;

                    file.getBlob(async (err, blob) => {
                      if (err) {
                        console.warn(err);
                        return;
                      }

                      console.log("Caching loaded file...", fileName, blob);
                      await saveFile(fileName, blob);
                      const element = document.querySelector(target);
                      if (
                        element?.dataset.played === "false" &&
                        !element?.getAttribute("src")
                      ) {
                        const cachedFile = await getCachedFile(fileName);
                        renderCachedFile(cachedFile, target);
                      }
                    });
                  });
                });
              });
            })
      );
    })
  );
  const contentItems = torrentTasks.reduce(
    (torrents, contentItems) => [...torrents, ...contentItems],
    []
  );

  runSerial(contentItems);
};
