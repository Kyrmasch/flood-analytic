import { Pagination as Pg } from "react-headless-pagination";
import "./Pagination.scss";

export interface IPagination {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  truncableText?: string | undefined;
  truncableClassName?: string | undefined;
  totalPages: number;
  edgePageCount: number;
}

const Pagination = (props: IPagination) => {
  return (
    <Pg
      edgePageCount={props.edgePageCount}
      middlePagesSiblingCount={0}
      totalPages={props.totalPages}
      currentPage={props.currentPage}
      setCurrentPage={props.setCurrentPage}
      className="pg_container"
      truncableText="..."
      truncableClassName=""
    >
      <Pg.PrevButton className="pg_prev">
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        <span className="sr-only">Назад</span>
      </Pg.PrevButton>

      <nav className="">
        <ul className="pg_ul">
          <Pg.PageButton
            activeClassName="pg_active"
            inactiveClassName="pg_inactive"
            className=""
          />
        </ul>
      </nav>

      <Pg.NextButton className="pg_next">
        <span className="sr-only">Вперед</span>
        <svg
          className="shrink-0 size-3.5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </Pg.NextButton>
    </Pg>
  );
};

export default Pagination;
