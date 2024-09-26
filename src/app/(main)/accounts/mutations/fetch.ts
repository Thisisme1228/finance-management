import kyInstance from "@/lib/ky";

export async function fetchData(options: {
  pageIndex: number;
  pageSize: number;
}) {
  const {
    status,
    data,
    totalCount = 0,
    nextCursor,
  }: {
    status: number;
    data?: [];
    totalCount?: number;
    nextCursor?: string;
  } = await kyInstance
    .get("/api/accounts/table-data", {
      searchParams: { ...options },
    })
    .json();

  if (status === 200) {
    return {
      rows: data,
      pageCount: Math.ceil(totalCount / options.pageSize),
      rowCount: totalCount,
      nextCursor,
    };
  }
  return {
    rows: [],
    pageCount: 0,
    rowCount: 0,
    nextCursor,
  };
}
