import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import { useGetDataQuery } from "../domain/store/api/data";
import DefaultTable from "../components/tables/DefaultTable";

function ReferencePage() {
  const { data: data } = useGetDataQuery(
    { tablename: "regions", limit: 10, offset: 0 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <div className="flex flex-col h-screen justify-between pt-[2.8rem]">
      <Container
        header={<></>}
        main={data && <DefaultTable tableName="regions" data={data} />}
      ></Container>
    </div>
  );
}

export default ReferencePage;
