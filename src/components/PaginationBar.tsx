"use client";

import Link from "next/link";

interface PaginationBarProps {
  current: number;
  total: number;
  size: number;
  searchParams: Record<string, any>;
}

export default function PaginationBar({
  current,
  total,
  size,
  searchParams,
}: PaginationBarProps) {
  const totalPage = Math.ceil(total / size);
  const maxPage = Math.min(totalPage, Math.max(current + 4, 10));
  const minPage = Math.max(1, Math.min(current - 5, maxPage - 9));

  const buttons: JSX.Element[] = [];
  for (let page = minPage; page <= maxPage; page++) {
    buttons.push(
      <Link
        key={page}
        href={{ query: { ...searchParams, p: page } }}
        className={`btn join-item ${current === page ? "btn-active pointer-events-none" : ""}`}
      >
        {page}
      </Link>,
    );
  }

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="join">
      {minPage > 1 && (
        <Link
          href={{ query: { ...searchParams, p: 1 } }}
          className="btn join-item"
        >
          1
        </Link>
      )}
      <Link
        href={{ query: { ...searchParams, p: current - 1 } }}
        className={`btn join-item ${current <= 1 ? "btn-disabled" : ""}`}
      >
        «
      </Link>
      {buttons}
      <Link
        href={{ query: { ...searchParams, p: current + 1 } }}
        className={`btn join-item ${current >= maxPage ? "btn-disabled" : ""}`}
      >
        »
      </Link>
      {maxPage < totalPage && (
        <Link
          href={{ query: { ...searchParams, p: totalPage } }}
          className="btn join-item"
        >
          {totalPage}
        </Link>
      )}
    </div>
  );
}
