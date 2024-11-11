import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import { useGetDataQuery } from "../domain/store/api/data";
import DefaultTable from "../components/tables/DefaultTable";
import React from "react";
import ReferenceHeader from "../components/headers/Reference";

function ReferencePage() {
  const [offset, setOffset] = React.useState<number>(0);
  const [table, setTable] = React.useState<string | null>(null);
  const { data: data } = useGetDataQuery(
    { tablename: table ?? "", limit: 20, offset: offset },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <Container
      header={<ReferenceHeader OnSelect={setTable} />}
      main={
        data &&
        table && (
          <DefaultTable tableName={table} data={data} setOffset={setOffset} />
        )
      }
    ></Container>
  );
}

export default ReferencePage;
