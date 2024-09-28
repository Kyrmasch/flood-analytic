import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import { useGetDataQuery } from "../domain/store/api/data";

function ReferencePage() {
  const { data: data } = useGetDataQuery(
    { tablename: "regions", limit: 10, offset: 0 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <div className="flex flex-col h-screen justify-between pt-[2.8rem]">
      <Container header={<></>} main={data && <></>}></Container>
    </div>
  );
}

export default ReferencePage;
