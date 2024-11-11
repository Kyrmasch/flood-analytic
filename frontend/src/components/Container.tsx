import React, { ReactNode } from "react";

// Интерфейс для типизации пропсов
interface ContainerProps {
  header: ReactNode;
  main: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ header, main }) => {
  return (
    <div className="flex flex-col w-full flex-1 min-h-0">
      <div>{header}</div>
      <main className="flex-grow flex min-h-0">{main}</main>
    </div>
  );
};

export default Container;
