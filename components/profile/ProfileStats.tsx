import Link from "next/link";

type Props = {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  className?: string;
  profileUsername?: string;
};

const col =
  "min-w-[4.5rem] flex-1 text-center sm:flex-none sm:text-left rounded-lg -mx-1 px-1 py-0.5 transition-colors";
const valueCls =
  "text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50 md:text-lg";
const labelCls = "text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm";
const linkLabelCls = `${labelCls} group-hover:text-violet-600 dark:group-hover:text-violet-400`;

export function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
  className = "",
  profileUsername,
}: Props) {
  const enc = profileUsername ? encodeURIComponent(profileUsername) : null;
  const followersLabel = followersCount === 1 ? "follower" : "followers";

  return (
    <div className={`flex ${className}`}>
      <div className={`${col}`}>
        <p className={valueCls}>{postsCount.toLocaleString()}</p>
        <p className={labelCls}>{postsCount === 1 ? "post" : "posts"}</p>
      </div>

      {enc ? (
        <Link
          href={`/profile/${enc}/followers`}
          className={`${col} group text-left no-underline hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50`}
        >
          <p className={valueCls}>{followersCount.toLocaleString()}</p>
          <p className={linkLabelCls}>{followersLabel}</p>
        </Link>
      ) : (
        <div className={col}>
          <p className={valueCls}>{followersCount.toLocaleString()}</p>
          <p className={labelCls}>{followersLabel}</p>
        </div>
      )}

      {enc ? (
        <Link
          href={`/profile/${enc}/following`}
          className={`${col} group text-left no-underline hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50`}
        >
          <p className={valueCls}>{followingCount.toLocaleString()}</p>
          <p className={linkLabelCls}>following</p>
        </Link>
      ) : (
        <div className={col}>
          <p className={valueCls}>{followingCount.toLocaleString()}</p>
          <p className={labelCls}>following</p>
        </div>
      )}
    </div>
  );
}
