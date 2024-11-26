import "leaflet/dist/leaflet.css";
import Container from "../components/Container";
import { useGetDataQuery } from "../domain/store/api/data";
import DefaultTable from "../components/tables/DefaultTable";
import React from "react";
import ReferenceHeader from "../components/headers/Reference";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useGetMetaQuery } from "../domain/store/api/meta";
import DynamicForm from "../components/DynamicForm";

function ReferencePage() {
  const [offset, setOffset] = React.useState<number>(0);
  const [table, setTable] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const { data: data } = useGetDataQuery(
    { tablename: table ?? "", limit: 10, offset: offset },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: metadata } = useGetMetaQuery(
    { tablename: table ?? "" },
    {
      skip: !table || !isModalOpen, // Выполнять запрос только если таблица выбрана и модальное окно открыто
    }
  );

  return (
    <Container
      header={
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReferenceHeader
            OnSelect={setTable}
            child={
              table && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  style={{ marginLeft: "10px" }}
                >
                  Добавить
                </Button>
              )
            }
          />
        </div>
      }
      main={
        <>
          {data && table && (
            <DefaultTable tableName={table} data={data} setOffset={setOffset} />
          )}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Добавить данные"
          >
            {metadata ? (
              <DynamicForm
                metadata={metadata}
                onSubmit={(data) => console.log(data)}
              />
            ) : (
              <p>Загрузка метаданных...</p>
            )}
          </Modal>
        </>
      }
    ></Container>
  );
}

export default ReferencePage;
