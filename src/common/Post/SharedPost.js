import React, { useEffect, useCallback, useState } from "react";
import moment from "moment";
import Tooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import {
  updateWallPost,
  getUserWallPostContent,
  getUserWallPostInfo
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

  const loadPostUser = useCallback(async () => {
    const userInfo = await dispatch(
      getUserWallPostInfo({ publicKey: postPublicKey, id: postID })
    );
    setPostUser(userInfo);
  }, [dispatch, postID, postPublicKey]);

  const loadPostContent = useCallback(async () => {
    const userPost = await dispatch(
      getUserWallPostContent({ publicKey: postPublicKey, id: postID })
    );
    setPostContent(userPost);
    setPostLoading(false);
    attachMedia([userPost], false);
  }, [dispatch, postID, postPublicKey]);

  const loadPost = useCallback(async () => {
    setPostLoading(true);
    if (!postPublicKey) return;
    loadPostUser();
    loadPostContent();
  }, [loadPostContent, loadPostUser, postPublicKey]);

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
            contentItems={postContent.contentItems}
            username={postUser.displayName ?? postUser.alias}
            isOnlineNode={isOnlineNode}
            shared={true}
            pinned={pinned}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SharedPost;
