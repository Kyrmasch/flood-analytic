import React, { ReactNode } from "react";

// Интерфейс для типизации пропсов
interface ContainerProps {
  header: ReactNode;
  main: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ header, main }) => {
  return (
    <div
      className="flex flex-col w-full"
      style={{ minHeight: "calc(100vh - 3.5rem)" }}
    >
      <div className="md:ml-64">{header}</div>
      <main className="md:ml-64 flex-grow">{main}</main>
    </div>
  );
};

export default Container;
