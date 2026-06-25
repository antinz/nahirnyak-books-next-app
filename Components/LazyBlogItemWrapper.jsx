import React, { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";

const LazyBlogItem = lazy(() => import("./BlogItem"));

const LazyBlogItemWrapper = ({ item }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
    threshold: 0,
  });

  return (
    <div ref={ref}>
      {inView && (
        <Suspense
          fallback={
            <div className="animate-pulse rounded shadow p-4 border border-gray-200 h-64 flex flex-col gap-4 bg-white">
              <div className="bg-gray-200 h-32 w-full rounded" />{" "}
              {/* image placeholder */}
              <div className="h-4 bg-gray-200 rounded w-3/4" />{" "}
              {/* title placeholder */}
              <div className="h-3 bg-gray-200 rounded w-full" /> {/* line 1 */}
              <div className="h-3 bg-gray-200 rounded w-5/6" /> {/* line 2 */}
            </div>
          }
        >
          <LazyBlogItem {...item} />
        </Suspense>
      )}
    </div>
  );
};

export default LazyBlogItemWrapper;
