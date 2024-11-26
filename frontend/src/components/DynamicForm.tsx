import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { StyledInput, StyledForm } from "../components/Form";
import fieldLabels from "../../public/locales/ru/translation.json";
import { useGetDataQuery } from "../domain/store/api/data";

interface FieldLabels {
  [key: string]: string;
}

interface Metadata {
  columns: Array<{ name: string; type: string }>;
  relationships?: Array<{
    relation: string;
    related_model: string;
    foreign_keys: string[];
  }>;
}

interface DynamicFormProps {
  metadata: Metadata;
  onSubmit: SubmitHandler<any>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ metadata, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const labels: FieldLabels = fieldLabels;

  // Проверка на наличие relationships и игнорирование, если foreign_keys содержит только 'id'
  const relevantRelationship = metadata.relationships?.find(
    (rel) => !(rel.foreign_keys.length === 1 && rel.foreign_keys[0] === "id")
  );

  // Определяем название таблицы для связанных данных
  const relatedTable = relevantRelationship
    ? `${relevantRelationship.relation}s`
    : undefined;

  // Определяем название ключа для передачи ID из выпадающего списка
  const foreignKey = relevantRelationship?.foreign_keys.find((key) =>
    metadata.columns.some((column) => column.name === key)
  );

  // Хук для получения данных из связанной таблицы, если она существует
  const { data: relatedData, isLoading: relatedLoading } = useGetDataQuery(
    relatedTable
      ? { tablename: relatedTable, limit: 100, offset: 0 }
      : { tablename: "", limit: 0, offset: 0 },
    { skip: !relatedTable, refetchOnMountOrArgChange: true }
  );

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {metadata.columns
        .filter((field) => field.name !== "id" && field.name !== foreignKey) // Исключаем поле, соответствующее foreignKey
        .map((field) => {
          let inputType = "text";
          if (field.type === "INTEGER") {
            inputType = "number";
          } else if (field.type.startsWith("geometry")) {
            inputType = "file";
          }
          return (
            <StyledInput
              key={field.name}
              id={field.name}
              label={labels[field.name] || field.name}
              type={inputType}
              register={register}
              required={true}
              errorMessage={
                errors[field.name]
                  ? "Это поле обязательно для заполнения"
                  : undefined
              }
            />
          );
        })}

      {relatedTable && foreignKey && (
        // Поле для выбора района
        <div style={{ marginTop: "16px" }}>
          <label
            htmlFor={foreignKey}
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Выберите район
          </label>
          <select
            id={foreignKey}
            {...register(foreignKey, { required: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Выбрать</option>
            {relatedLoading ? (
              <option disabled>Загрузка данных...</option>
            ) : (
              relatedData?.data.map((row: any) => (
                <option key={row.data.id} value={row.data.id}>
                  {row.data.name}
                </option>
              ))
            )}
          </select>
          {errors[foreignKey] && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Необходимо выбрать район
            </span>
          )}
        </div>
      )}

      {/* Кнопка отправки */}
      <button
        type="submit"
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Отправить
      </button>
    </StyledForm>
  );
};

export default DynamicForm;
