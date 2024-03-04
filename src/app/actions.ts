import prisma from "@/lib/db/prisma";
import { Item } from "@prisma/client";

export interface SearchOptions {
  currentPage?: number;
  pageSize?: number;
  catsFilter?: string[];
  titleFilter?: string;
}

export async function findItems({
  catsFilter,
  titleFilter,
  currentPage,
  pageSize,
}: SearchOptions) {
  "use server";
  let cats = [
    "movies",
    "movies_bd_full",
    "movies_bd_remux",
    "movies_x264",
    "movies_x264_3d",
    "movies_x264_4k",
    "movies_x264_720",
    "movies_x265",
    "movies_x265_4k",
    "movies_x265_4k_hdr",
    "movies_xvid",
    "movies_xvid_720",
    "tv",
    "tv_sd",
    "tv_uhd",
  ];
  const genres = ["movies", "tv"];
  if (catsFilter?.length && genres.some((e) => catsFilter.includes(e))) {
    genres.forEach((genre) => {
      if (!catsFilter.includes(genre)) {
        cats = cats.filter((e) => !e.startsWith(genre));
      }
    });
  }
  const andGroup: Array<
    | { imdb: string }
    | { title: { contains: string } }
    | { OR: { title: { contains: string } }[] }
  > = [];
  if (titleFilter) {
    if (/^tt\d+$/.test(titleFilter)) {
      andGroup.push({ imdb: titleFilter });
    } else {
      const pattern =
        "%" + titleFilter.replace(/[\\%_]/g, "\\$&").replace(/\s+/g, "%") + "%";
      andGroup.push({ title: { contains: pattern } });
    }
  }
  const alias: Record<string, string[]> = {
    "4k": ["2160p", "uhd"],
    x264: ["h264"],
    x265: ["h265", "hevc"],
  };
  if (catsFilter?.length) {
    [
      ["x264", "x265", "xvid"],
      ["4k", "1080p", "720p"],
    ].forEach((group) => {
      const orGroup: { title: { contains: string } }[] = [];
      group.forEach((key) => {
        if (catsFilter.includes(key)) {
          orGroup.push({
            title: { contains: `.${key}` },
          });
          if (alias[key]) {
            alias[key].forEach((a) => {
              orGroup.push({
                title: { contains: `.${a}` },
              });
            });
          }
        }
      });
      if (orGroup.length) {
        if (orGroup.length > 1) {
          andGroup.push({ OR: orGroup });
        } else {
          andGroup.push(orGroup[0]);
        }
      }
    });
  }
  const total = await prisma.item.count({
    where: {
      AND: [
        {
          cat: {
            in: cats,
          },
        },
        ...andGroup,
      ],
    },
  });
  const current = currentPage ? Math.max(0, currentPage - 1) : 0;
  const list: Item[] = !total
    ? []
    : await prisma.item.findMany({
        where: {
          AND: [
            {
              cat: {
                in: cats,
              },
            },
            ...andGroup,
          ],
        },
        skip: Math.min(pageSize || 0, 100) * current,
        take: Math.min(pageSize || 0, 100),
        orderBy: {
          dt: "desc",
        },
      });

  return {
    list,
    current: current + 1,
    total,
  };
}
