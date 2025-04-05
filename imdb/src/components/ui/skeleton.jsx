import clsx from "clsx";

export const Skeleton = ({ className }) => {
    return <div className={clsx("animate-pulse bg-gray-300 rounded", className)} />;
};