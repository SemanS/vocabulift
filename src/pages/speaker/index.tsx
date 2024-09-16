import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "antd";
import ReactECharts from "echarts-for-react";
import "echarts-wordcloud";
import { getTriples } from "@/services/analyticService";
import { WordTriple } from "@/pages/webLayout/shared/common/types";

const Speaker: React.FC = () => {
  const [wordTriplesMusk, setWordTriplesMusk] = useState<WordTriple[]>([]);
  const [wordTriplesZuckenberg, setWordTriplesZuckenberg] = useState<
    WordTriple[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const chartRef1 = useRef<ReactECharts>(null);
  const chartRef2 = useRef<ReactECharts>(null);
  const donutChartRef1 = useRef<ReactECharts>(null);
  const donutChartRef2 = useRef<ReactECharts>(null);

  // Hardcoded libraryIds
  const libraryIdsMusk = [
    { libraryId: "66d8865b20c573b77399f733", speaker: 1 },
    { libraryId: "66d8868020c573b77399fa7f", speaker: 1 },
    { libraryId: "66d8cd1da32ca5da2044c52d", speaker: 1 },
    { libraryId: "66d8cfe3a81ebf0bbdb995b4", speaker: 0 },
    { libraryId: "66d98c1a6df3038aa08e2e37", speaker: 0 },
  ];

  const libraryIdsZuckenberg = [
    { libraryId: "66d97e491e26315751e6d5fd", speaker: 0 },
    { libraryId: "66d97e3e1e26315751e6d4d6", speaker: 1 },
    { libraryId: "66d98bf26df3038aa08e29cf", speaker: 1 },
  ];

  // Function to generate the word cloud options
  const getWordCloudOptions = (wordTriples: WordTriple[]) => ({
    tooltip: {},
    series: [
      {
        type: "wordCloud",
        gridSize: 2,
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        shape: "circle",
        width: "100%",
        height: "100%",
        textStyle: {
          normal: {
            color: () =>
              `rgb(${[
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(",")})`,
          },
        },
        data: wordTriples.map((triple) => ({
          name: triple.wordTriple, // Triple text
          value: triple.count, // Triple count
        })),
      },
    ],
  });

  // Donut chart options showing 79%
  const getDonutChartOptions = () => ({
    series: [
      {
        name: "Donut",
        type: "pie",
        radius: ["60%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 79,
            name: "Complete",
            itemStyle: {
              color: "#4CAF50", // Green for 79% complete
            },
          },
          {
            value: 21,
            name: "Incomplete",
            itemStyle: {
              color: "#ddd", // Grey for the remainder
            },
          },
        ],
      },
    ],
    animation: true,
  });

  // Fetch word triples for Musk and Zuckerberg separately
  useEffect(() => {
    const fetchTriples = async () => {
      try {
        // Fetch Musk triples
        const dataMusk = await getTriples(libraryIdsMusk);
        const parsedDataMusk = JSON.parse(dataMusk);
        setWordTriplesMusk(parsedDataMusk);

        // Fetch Zuckerberg triples
        const dataZuckenberg = await getTriples(libraryIdsZuckenberg);
        const parsedDataZuckenberg = JSON.parse(dataZuckenberg);
        setWordTriplesZuckenberg(parsedDataZuckenberg);
      } catch (err: any) {
        setError("Failed to fetch word triples");
      }
    };

    fetchTriples();
  }, []);

  // Update the charts with new data when word triples change
  useEffect(() => {
    if (chartRef1.current) {
      chartRef1.current
        .getEchartsInstance()
        .setOption(getWordCloudOptions(wordTriplesMusk));
    }
    if (chartRef2.current) {
      chartRef2.current
        .getEchartsInstance()
        .setOption(getWordCloudOptions(wordTriplesZuckenberg));
    }
    if (donutChartRef1.current) {
      donutChartRef1.current
        .getEchartsInstance()
        .setOption(getDonutChartOptions());
    }
    if (donutChartRef2.current) {
      donutChartRef2.current
        .getEchartsInstance()
        .setOption(getDonutChartOptions());
    }
  }, [wordTriplesMusk, wordTriplesZuckenberg]);

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <h3>Speaker Word Clouds and Donut Charts</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <h4>Musk</h4>
            {/* Donut Chart for Musk */}
            <ReactECharts
              ref={donutChartRef1}
              option={getDonutChartOptions()}
              style={{ width: "100%", height: "200px" }}
            />
            {/* Word Cloud for Musk */}
            <ReactECharts
              ref={chartRef1}
              option={getWordCloudOptions(wordTriplesMusk)}
              style={{ width: "100%", height: "400px" }}
            />
          </Col>
          <Col span={12}>
            <h4>Zuckenberg</h4>
            {/* Donut Chart for Zuckenberg */}
            <ReactECharts
              ref={donutChartRef2}
              option={getDonutChartOptions()}
              style={{ width: "100%", height: "200px" }}
            />
            {/* Word Cloud for Zuckenberg */}
            <ReactECharts
              ref={chartRef2}
              option={getWordCloudOptions(wordTriplesZuckenberg)}
              style={{ width: "100%", height: "400px" }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Speaker;
