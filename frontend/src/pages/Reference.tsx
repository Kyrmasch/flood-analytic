import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import { useGetDataQuery } from "../domain/store/api/data";
import DefaultTable from "../components/tables/DefaultTable";
import React from "react";

function ReferencePage() {
  const [offset, setOffset] = React.useState<number>(0);
  const { data: data } = useGetDataQuery(
    { tablename: "regions", limit: 10, offset: offset },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <div className="flex flex-col h-screen justify-between pt-[3.5rem]">
      <Container
        header={<></>}
        main={
          data && (
            <DefaultTable
              tableName="regions"
              data={data}
              setOffset={setOffset}
            />
          )
        }
      ></Container>
    </div>
  );
}

export default ReferencePage;
