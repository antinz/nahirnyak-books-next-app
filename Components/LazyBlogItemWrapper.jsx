import React, { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";

const LazyBlogItem = lazy(() => import("./BlogItem"));

const LazyBlogItemWrapper = ({ item }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div ref={ref}>
      {inView && (
        <Suspense
          fallback={<div className="h-64 bg-gray-100 rounded">Loading...</div>}
        >
          <LazyBlogItem {...item} />
        </Suspense>
      )}
    </div>
  );
};

export default LazyBlogItemWrapper;
