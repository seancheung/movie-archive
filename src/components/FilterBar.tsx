"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterBar() {
  const options = [
    "movies",
    "tv",
    "x265",
    "x264",
    "xvid",
    "4k",
    "1080p",
    "720p",
  ];
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(() => searchParams.get("title") || "");
  const [cats, setCats] = useState<string[]>(
    () => searchParams.getAll("cats") || [],
  );
  const router = useRouter();

  const handleReset = () => {
    setTitle(() => "");
    setCats(() => []);
    router.push("/");
  };
  const handleSubmit = () => {
    const params = Object.fromEntries(searchParams.entries());
    delete params.p;
    const search = new URLSearchParams(params);
    if (!title) {
      search.delete("title");
    } else {
      search.set("title", title);
    }
    search.delete("cats");
    if (cats.length) {
      cats.forEach((cat) => search.append("cats", cat));
    }
    router.push(`/?${search.toString()}`);
  };

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div className="flex gap-4">
        <label className="input input-bordered flex flex-1 items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Movie title or IMDB ID"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
                handleSubmit();
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="join">
          <button
            className="btn join-item"
            type="submit"
            onClick={handleSubmit}
          >
            Search
          </button>
          <button className="btn join-item" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((option) => (
          <label key={option} className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              className="checkbox"
              value="on"
              checked={cats.includes(option)}
              onChange={(e) => {
                setCats((value) => {
                  if (e.target.checked) {
                    return value.includes(option) ? value : [...value, option];
                  }
                  return value.filter((val) => val !== option);
                });
              }}
            />
            <span className="label-text">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
