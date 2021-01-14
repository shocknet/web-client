import { memo } from "react";

/**
 * @template T
 * @typedef {import('react').MemoExoticComponent<T>} MemoExoticComponent
 */
/**
 * @template P
 * @typedef {import('react').FunctionComponent<P>} FunctionComponent
 */

/**
 * @template P
 * @param {FunctionComponent<P>} component
 * @returns {MemoExoticComponent<FunctionComponent<P>>}
 */
export const betterReactMemo = (component) => {
  const MemoizedComponent = memo(component);

  if (component.displayName) {
    MemoizedComponent.displayName = "Memoized" + component.displayName;
  }

  // Not supported according to the typings but needed in some
  // cases.
  MemoizedComponent.propTypes = component.propTypes;

  return MemoizedComponent;
};
