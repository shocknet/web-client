import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import {
  updateWallPost,
  getUserPost,
  fetchUserProfile
} from "../../actions/UserActions";
import { listenPath, gunUser } from "../../utils/Gun";

import Post from ".";

import av1 from "../../images/av1.jpg";
import "../Post/css/index.css";
import { attachMedia } from "../../utils/Torrents";
import Loader from "../Loader";
import NoticeBar from "./components/NoticeBar";

const SharedPost = ({
  sharedPostId,
  sharerPublicKey,
  sharerUsername,
  sharerAvatar,
  sharedTimestamp,
  isOnlineNode,
  postID,
  postPublicKey,
  openTipModal,
  pinned
}) => {
  const dispatch = useDispatch();
  const [postLoading, setPostLoading] = useState(true);
  const [postContent, setPostContent] = useState(null);
  const [postUser, setPostUser] = useState(null);

  useEffect(() => {
    listenPath({
      path: `posts/${sharedPostId}/tipCounter`,
      gunPointer: gunUser(sharerPublicKey),
      callback: data => {
        dispatch(
          updateWallPost({
            postID: sharedPostId,
            data: {
              tipCounter: data
            }
          })
        );
      }
    });
    listenPath({
      path: `posts/${sharedPostId}/tipValue`,
      gunPointer: gunUser(sharerPublicKey),
      callback: data => {
        dispatch(
          updateWallPost({
            postID: sharedPostId,
            data: {
              tipValue: data
            }
          })
        );
      }
    });
  }, [dispatch, sharedPostId, sharerPublicKey]);

  const loadPost = useCallback(async () => {
    setPostLoading(true);
    if (!postPublicKey) return;
    const [userProfile, userPost] = await Promise.all([
      fetchUserProfile({ publicKey: postPublicKey, includeAvatar: true }),
      getUserPost({
        id: postID,
        gunPointer: gunUser(postPublicKey)
      })
    ]);
    setPostUser(userProfile);
    setPostContent(userPost);
    setPostLoading(false);
    attachMedia([userPost], false);
  }, [postID, postPublicKey]);

  useEffect(() => {
    Tooltip.rebuild();
    loadPost();
  }, [loadPost]);

  return (
    <div className="post shared-post">
      <NoticeBar text="Linked post" visible={pinned} />
      <div className="head">
        <div className="user">
          <div
            className="av"
            style={{
              backgroundImage: `url(${sharerAvatar})`
            }}
          ></div>
          <div className="details">
            <p>{sharerUsername}</p>
            <p>{moment.utc(sharedTimestamp).fromNow()}</p>
          </div>
        </div>
      </div>

      <div className="shared-content">
        {postLoading ? (
          <Loader text="Loading Post..." />
        ) : postContent && postUser ? (
          <Post
            id={postContent.id}
            timestamp={postContent.date}
            avatar={
              postUser.avatar ? `data:image/png;base64,${postUser.avatar}` : av1
            }
            tipCounter={postContent.tipCounter}
            tipValue={postContent.tipValue}
            publicKey={postPublicKey}
            openTipModal={openTipModal}
            contentItems={postContent.contentItems}
            username={postUser.displayName ?? postUser.alias}
            isOnlineNode={isOnlineNode}
            shared={true}
            pinned={pinned}
          />
        ) : null}
      </div>

      {/* <div className="actions">
        <div
          className="icon-tip-btn"
          data-tip="Tip this post"
          onClick={tipPost}
        >
          <div className="tip-icon icon-thin-feed"></div>
        </div>
      </div> */}
    </div>
  );
};

export default SharedPost;
