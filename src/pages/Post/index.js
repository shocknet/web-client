import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getPinnedPost,
  getUserAvatar,
  getUserProfile,
  resetUserData
} from "../../actions/UserActions";
import { attachMedia } from "../../utils/Torrents";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import Loader from "../../common/Loader";
import NavBar from "../../common/NavBar";
import av1 from "../../images/av1.jpg";
import "./css/index.css";
import TipModal from "../../common/TipModal";

const Post = React.lazy(() => import("../../common/Post"));
const SharedPost = React.lazy(() => import("../../common/Post/SharedPost"));

const PostPage = () => {
  // Third-party hooks
  const dispatch = useDispatch();
  const { postId, type, userId } = useParams();
  const history = useHistory();
  const profile = useSelector(({ user }) => user.profile);
  const pinnedPost = useSelector(({ user }) => user.wall?.pinnedPost);

  // States
  const [loading, setLoading] = useState(true);
  const { isOnlineNode } = useOnlineStatus(userId);

  // Memos
  const username = useMemo(
    () => profile.displayName ?? profile.alias ?? `POSTS`,
    [profile.alias, profile.displayName]
  );

  // Callbacks
  const fetchUser = useCallback(async () => {
    dispatch(resetUserData());
    await dispatch(getUserProfile(userId));
    dispatch(getUserAvatar(userId));
  }, [dispatch, userId]);

  const fetchSelectedPost = useCallback(async () => {
    dispatch(
      getPinnedPost({
        postId,
        type,
        publicKey: userId
      })
    );
  }, [dispatch, postId, type, userId]);

  const initializeData = useCallback(async () => {
    setLoading(true);
    await fetchUser();
    fetchSelectedPost();
    setLoading(false);
  }, [fetchSelectedPost, fetchUser]);

  const goBack = useCallback(() => {
    history.push(`/${userId}`);
  }, [history, userId]);

  const renderPost = useCallback(
    post => {
      if (!post) {
        return;
      }

      const avatar = profile.avatar
        ? `data:image/png;base64,${profile.avatar}`
        : av1;

      if (post.type === "shared") {
        return (
          <Suspense
            fallback={
              <div className="post-loading">
                <Loader text="Loading Post..." />
              </div>
            }
            key={post.id}
          >
            <SharedPost
              postID={post.id}
              postPublicKey={post.originalAuthor}
              sharedPostId={post.id}
              sharedTimestamp={post.date}
              sharerAvatar={avatar}
              sharerPublicKey={userId}
              sharerUsername={username}
              isOnlineNode={isOnlineNode}
            />
          </Suspense>
        );
      }

      if (post.type === "post") {
        return (
          <Suspense
            fallback={
              <div className="post-loading">
                <Loader text="Loading Post..." />
              </div>
            }
            key={post.id}
          >
            <Post
              timestamp={post.date}
              contentItems={post.contentItems}
              username={username}
              avatar={avatar}
              publicKey={userId}
              page={post.page}
              id={post.id}
              tipValue={post.tipValue ?? 0}
              tipCounter={post.tipCounter ?? 0}
              isOnlineNode={isOnlineNode}
            />
          </Suspense>
        );
      }
    },
    [isOnlineNode, profile.avatar, userId, username]
  );

  // Effects
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (pinnedPost) {
      attachMedia([pinnedPost], false);
    }
  }, [pinnedPost]);

  if (loading) {
    return <Loader text="Loading Post..." />;
  }

  return (
    <div className="post-page has-nav">
      <NavBar title={username} goBack={goBack} />
      <div className="posts-container">{renderPost(pinnedPost)}</div>
      <TipModal publicKey={userId} />
    </div>
  );
};

export default PostPage;
