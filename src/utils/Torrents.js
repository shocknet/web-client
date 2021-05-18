import { getCachedFile, renderCachedFile, saveFile } from "./Cache";
import { runSerial } from "./Promise";

const supportedFileTypes = {
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

export const attachMedia = async (posts = [], torrentMode = true) => {
  const torrentTasks = posts
    .map(post => {
      const { contentItems, id } = post;
      const supportedItems = Object.entries(contentItems).filter(
        ([, item]) => supportedFileTypes[item.type]
      );

      if (!supportedItems) {
        return [];
      }

      return supportedItems.map(
        ([key, item]) =>
          () =>
            new Promise(resolve => {
              initializeClient().then(webTorrentClient => {
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

                  files.map(async file => {
                    const fileType = _getFileType(file);

                    if (!fileType) {
                      return;
                    }

                    const fileName = `${id}-${key}-${file.name}`;

                    const element = fileType.element;
                    const target = `${element}[data-torrent="${item.magnetURI}"]`;
                    const cachedFile = await getCachedFile(fileName);

                    if (cachedFile) {
                      const torrent = webTorrentClient.get(item.magnetURI);

                      if (torrent) {
                        torrent.destroy();
                      }

                      renderCachedFile(cachedFile, target);
                      return;
                    }

                    const torrentElements = document.querySelectorAll(target);
                    console.log("Torrent Elements:", torrentElements);
                    torrentElements.forEach(torrentElement => {
                      const contentURL = decodeURIComponent(
                        item.magnetURI.replace(/.*(ws=)/gi, "")
                      );
                      const [compatibleURL] = fileType.formats.filter(format =>
                        contentURL
                          .toLowerCase()
                          .endsWith(`.${format.toLowerCase()}`)
                      );

                      if (torrentMode || !compatibleURL) {
                        file.renderTo(torrentElement, fileType.options);
                        return;
                      }

                      torrentElement.setAttribute("src", contentURL);
                    });
                  });

                  torrent.on("done", () => {
                    files.map(file => {
                      const fileType = _getFileType(file);
                      const fileName = `${id}-${key}-${file.name}`;
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
                        if (element.dataset.played === "false") {
                          const cachedFile = await getCachedFile(fileName);
                          renderCachedFile(cachedFile, target);
                        }
                      });
                    });
                  });
                });
              });
            })
      );
    })
    .reduce((torrents, contentItems) => [...torrents, ...contentItems], []);

  runSerial(torrentTasks);
};
