import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

const containerStyle = {
  background: "white",
  margin: 10,
  flex: 1,
  height: "300px",
  border: "1px solid black",
  overflow: "auto"
};

interface ContainerProps {
  id: string;
  items: string[];
}

export default function Container(props: ContainerProps) {
  const { id, items } = props;

  const { setNodeRef } = useDroppable({id});

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </div>
    </SortableContext>
  );
}
