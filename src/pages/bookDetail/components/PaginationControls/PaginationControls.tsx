import React, { FC, useEffect, useRef, useState } from "react";
import { Pagination, PaginationProps } from "antd";

interface PaginationControlsProps {
  currentPage: number;
  onShowSizeChange: (current: number, size: number) => void;
  handlePageChange: (pageNum: number, pageSize: number) => void;
  totalSentences: number;
  sentencesPerPage: number;
  pageSizeLimitReached: (current: number, pageSize: number) => void;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  onShowSizeChange,
  handlePageChange,
  totalSentences,
  sentencesPerPage,
  pageSizeLimitReached,
}) => {
  return (
    <Pagination
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
      }}
      responsive={true}
      current={currentPage}
      onShowSizeChange={(pageNum, pageSize) => {
        if (pageSize * currentPage > totalSentences) {
          onShowSizeChange(currentPage, pageSize);
        } else {
          onShowSizeChange(pageNum, pageSize);
        }
      }}
      onChange={(pageNum, pageSize) => {
        if (
          pageNum === currentPage ||
          roundToNearestTen(pageSize * currentPage) - sentencesPerPage >=
            totalSentences
        ) {
        } else {
          handlePageChange(pageNum, pageSize);
        }
      }}
      total={totalSentences}
      pageSize={sentencesPerPage}
    />
  );
};

function roundToNearestTen(num: number) {
  const roundedNum = Math.floor(num / 10) * 10; // vypočítat nejbližší nižší celé číslo násobek deseti
  return roundedNum; // vrátit zaokrouhlené číslo
}

export default PaginationControls;
