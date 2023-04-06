import { Card } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { Input } from "antd";

const { Search } = Input;

export interface Word {
  id: number | null;
  language: string | null;
  word: string;
  translations: { language: string; name: string }[];
  definition: {
    meanings: {
      noun: string;
      verb: string;
      adverb: string;
      adjective: string;
    }[];
  };
  created_at: string;
}

const Vocabulary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/user/vocabulary`, {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    })
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setPage(page + 1);
        setHasMore(data.length < body.length);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <>
      <Search
        style={{ marginBottom: "20px" }}
        placeholder="input search text"
        enterButton="Search"
        size="large"
        loading={loading}
        onSearch={(value) => console.log(value)}
      />
      <Card
        style={{
          marginBottom: "20px",
        }}
      ></Card>
    </>
  );
};

export default Vocabulary;
