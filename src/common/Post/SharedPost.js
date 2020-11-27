import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import {
  updateWallPost,
  getUserPost,
  fetchUserProfile
} from "../../actions/UserActions";
import { listenPath, gunUser, Gun } from "../../utils/Gun";
import "../Post/css/index.css";
import Post from ".";

const SharedPost = ({
  sharedPostId,
  sharerPublicKey,
  sharerUsername,
  sharerAvatar,
  sharedTimestamp,
  isOnlineNode,
  postID,
  postPublicKey,
  openTipModal
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

  const tipPost = useCallback(() => {
    if (!isOnlineNode) {
      return;
    }

    openTipModal({
      targetType: "post",
      postID: sharedPostId
    });
  }, [isOnlineNode, openTipModal, sharedPostId]);

  const loadPost = useCallback(async () => {
    setPostLoading(true);
    const [userProfile, userPost] = await Promise.all([
      fetchUserProfile({ publicKey: postPublicKey, includeAvatar: true }),
      getUserPost({
        id: postID,
        gunPointer: Gun.user(postPublicKey)
      })
    ]);
    setPostUser(userProfile);
    setPostContent(userPost);
    setPostLoading(false);
  }, [postID, postPublicKey]);

  useEffect(() => {
    Tooltip.rebuild();
    loadPost();
  }, [loadPost]);

  return (
    <div className="post">
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
          <div className="loading" />
        ) : postContent && postUser ? (
          <Post
            id={postContent.id}
            timestamp={postContent.timestamp}
            avatar={postUser.avatar}
            tipCounter={postContent.tipCounter}
            tipValue={postContent.tipValue}
            publicKey={postContent.publicKey}
            openTipModal={openTipModal}
            contentItems={postContent.contentItems}
            username={postUser.username}
            isOnlineNode={isOnlineNode}
          />
        ) : null}
      </div>

      <div className="actions">
        <div
          className="icon-tip-btn"
          data-tip="Tip this post"
          onClick={tipPost}
        >
          <div className="tip-icon icon-thin-feed"></div>
        </div>
      </div>
    </div>
  );
};

export default SharedPost;
