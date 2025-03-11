import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useQueryString(
  key: string,
  defaultValue?: string,
): [string, (v: string) => void] {
  const [search, setSearch] = useSearchParams();

  const [state, setState] = useState(search.get(key) ?? defaultValue);

  const setValue = (value: string) => {
    setState(value);

    setSearch(prev => {
      prev.set(key, value);
      return prev;
    });
  };

  useEffect(() => {
    setState(search.get(key) ?? defaultValue);
  }, [search, key, defaultValue]);

  return [state ?? "", setValue];
}
