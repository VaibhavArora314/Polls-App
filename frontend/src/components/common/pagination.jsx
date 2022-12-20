import React from "react";
import _ from "lodash";

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount <= 1) return null;

  const pageList = () => {
    const begin = _.range(1, 3),
      end = _.range(pagesCount - 1, pagesCount + 1);
    if (currentPage == 1 || currentPage == pagesCount)
      return [...begin, "...", ...end];
    if (currentPage <= 4)
      return [..._.range(1, currentPage + 2), "...", ...end];
    if (currentPage >= pagesCount - 3)
      return [...begin, "...", ..._.range(currentPage - 1, pagesCount + 1)];

    return [
      ...begin,
      "...",
      ..._.range(currentPage - 1, currentPage + 2),
      "...",
      ...end,
    ];
  };

  const pages = pagesCount > 8 ? pageList() : _.range(1, pagesCount + 1);

  const renderItem = (page, index) => {
    {
      if (page == "...")
        return (
          <li className="page-item disabled" key={index}>
            <a onClick={() => {}} className="page-link">
              {page}
            </a>
          </li>
        );
      return (
        <li
          className={page === currentPage ? "page-item active" : "page-item"}
          key={index}
        >
          <a onClick={() => onPageChange(page)} className="page-link">
            {page}
          </a>
        </li>
      );
    }
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <a
            onClick={
              currentPage === 1 ? () => {} : () => onPageChange(currentPage - 1)
            }
            className="page-link"
          >
            Prev
          </a>
        </li>
        {pages.map((page, index) => renderItem(page, index))}
        <li
          className={
            currentPage === pagesCount ? "page-item disabled" : "page-item"
          }
        >
          <a
            onClick={
              currentPage === pagesCount
                ? () => {}
                : () => onPageChange(currentPage + 1)
            }
            className="page-link"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
