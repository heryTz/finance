export function getPageRange({
  pageIndex,
  pageCount,
  maxVisiblePages,
}: {
  pageIndex: number; // start with 1
  pageCount: number;
  maxVisiblePages: number;
}) {
  const half = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, pageIndex - half);
  let endPage = Math.min(pageCount, pageIndex + half);

  if (pageIndex <= half) {
    endPage = Math.min(pageCount, maxVisiblePages);
  } else if (pageIndex + half >= pageCount) {
    startPage = Math.max(1, pageCount - maxVisiblePages + 1);
  }

  const range: (number | boolean)[] = [];

  if (startPage > 1) {
    range.push(1);
    if (startPage > 2) {
      range.push(false);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  if (endPage < pageCount) {
    if (endPage < pageCount - 1) {
      range.push(false);
    }
    range.push(pageCount);
  }

  return range;
}
