function calculateBookPercentage(
  page: number,
  sentencesPerPage: number,
  totalSentences: number
) {
  const totalPages = Math.ceil(totalSentences / sentencesPerPage);
  const percentage = (Math.min(page, totalPages) / totalPages) * 100;
  return Math.floor(percentage) === 99 && page < totalSentences
    ? 99
    : Math.ceil(percentage);
}
