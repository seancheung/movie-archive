import FilterBar from "@/components/FilterBar";
import ItemTable from "@/components/ItemTable";
import PaginationBar from "@/components/PaginationBar";
import { Suspense } from "react";
import { findItems } from "./actions";

interface SearchParams {
  p?: string;
  title?: string;
  cats?: string[];
}
interface HomeProps {
  searchParams: SearchParams;
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="mx-4 mt-12 flex flex-col items-center gap-12">
      <FilterBar />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<div className="loading loading-infinity"></div>}
      >
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const pageSize = 20;
  const currentPage = Math.max(parseInt(searchParams.p || "1") || 1, 1);
  const titleFilter = searchParams.title;
  const catsFilter = searchParams.cats;

  const { list, current, total } = await findItems({
    catsFilter,
    titleFilter,
    currentPage,
    pageSize,
  });
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <ItemTable items={list} />
      <PaginationBar
        current={current}
        total={total}
        size={pageSize}
        searchParams={searchParams}
      />
    </div>
  );
}
