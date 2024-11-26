import React, { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface StyledFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const StyledForm: React.FC<StyledFormProps> = ({
  onSubmit,
  children,
  style,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        ...style,
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
      }}
    >
      {children}
    </form>
  );
};

interface StyledInputProps {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  errorMessage?: string;
  style?: React.CSSProperties;
}

export const StyledInput: React.FC<StyledInputProps> = ({
  id,
  label,
  type = "text",
  register,
  required = false,
  errorMessage,
  style,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  // Поле для загрузки файлов
  if (type === "file") {
    return (
      <div style={{ marginBottom: "16px" }}>
        <div className="flex items-center justify-center w-full">
          <div
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
              selectedFile ? "cursor-default" : ""
            }`}
          >
            {!selectedFile ? (
              <>
                <label
                  htmlFor={id}
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Перетащите файлы сюда или нажмите, чтобы выбрать
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Только файлы GeoJSON
                    </p>
                  </div>
                  <input
                    id={id}
                    type="file"
                    accept=".geojson"
                    {...register(id, {
                      required,
                      onChange: (e) =>
                        handleFileChange(e.target.files?.[0] || null),
                    })}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-lg font-bold text-gray-700 ">
                    {selectedFile.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFileChange(null)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Удалить файл
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {required && errorMessage && (
          <span
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "4px",
              display: "block",
              textAlign: "left",
            }}
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  }

  // Поле для остальных типов ввода
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id, { required })}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        style={{ ...style }}
      />
      {required && errorMessage && (
        <span
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
