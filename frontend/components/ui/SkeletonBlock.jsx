import { classNames } from "../../lib/classNames";

export default function SkeletonBlock({ className }) {
  return <div className={classNames("loading-shimmer rounded-2xl", className)} />;
}
