import { Item } from "@prisma/client";

interface ItemTableProps {
  items: Item[];
}

export default function ItemTable({ items }: ItemTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Cat.</th>
            <th>File</th>
            <th>Added</th>
            <th>Size</th>
            <th>IMDB</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th>{formatCat(item.cat)}</th>
              <td>
                <a className="link" href={`magnet:?xt=urn:btih:${item.hash}`}>
                  {item.title}
                </a>
              </td>
              <td>
                {item.dt ? new Date(item.dt).toLocaleDateString("en-US") : ""}
              </td>
              <td>{item.size ? humanFileSize(item.size) : ""}</td>
              <td>
                {item.imdb && (
                  <a
                    className="link"
                    href={`https://www.imdb.com/title/${item.imdb}`}
                    target="_blank"
                  >
                    {item.imdb}
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function humanFileSize(size: bigint) {
  const i = Math.floor(Math.log(Number(size)) / Math.log(1024));
  return (
    Number((Number(size) / Math.pow(1024, i)).toFixed(2)) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

function formatCat(cat: string) {
  if (cat.startsWith("movies")) {
    return "Movie";
  }
  if (cat.startsWith("tv")) {
    return "TV";
  }
  return "?";
}
