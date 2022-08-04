import { useState, useEffect } from "react";

export function useQuery(queryFn) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState();

  const forceRefresh = () => {
    setRefresh(Math.random());
  };

  useEffect(() => {
    const callQuery = async () => {
      try {
        setLoading(true);
        const data = await queryFn();
        setData(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    callQuery();
  }, [queryFn, refresh]);

  return { loading, error, data, forceRefresh };
}
