import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function useQueryParamSetting(obj: any) {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParams = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);

    for (const key in obj) {
      newParams.delete(key);
    }

    const hasPatientFilter =
      Object.prototype.hasOwnProperty.call(obj, "patientNameFilter") &&
      obj.patientNameFilter !== undefined &&
      obj.patientNameFilter !== null;

    const hasTabletFilter =
      Object.prototype.hasOwnProperty.call(obj, "tabletNameFilter") &&
      obj.tabletNameFilter !== undefined &&
      obj.tabletNameFilter !== null;

    const shouldAddParam = (key: string, value: any): boolean => {
      const sortParams = ["tabletNameSort", "patientNameSort", "admissionDateSort"];
      if (sortParams.includes(key) && value === "DEFAULT") {
        return false;
      }
      return value !== undefined && value !== null;
    };

    for (const key in obj) {
      if (key === "tabletNameFilter" && hasPatientFilter) {
        continue;
      }

      if (key === "patientNameFilter" && hasTabletFilter) {
        continue;
      }

      if (Array.isArray(obj[key])) {
        obj[key].forEach((value: string) => {
          if (shouldAddParam(key, value)) {
            newParams.append(key, value);
          }
        });
      } else {
        if (shouldAddParam(key, obj[key])) {
          newParams.append(key, obj[key]);
        }
      }
    }

    setSearchParams(newParams);
  }, [obj, searchParams, setSearchParams]);

  useEffect(() => {
    updateQueryParams();
  }, [obj, updateQueryParams]);

  return searchParams.toString();
}
