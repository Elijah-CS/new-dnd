import React, { forwardRef, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Item = forwardRef(({ label, ...props }, ref) => {
  return (
    <div ref={ref} className="item" {...props}>
      {label}
    </div>
  );
});

function SortableItem({ index, style, data }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: data[index] });

  const itemStyle = {
    ...(style ?? {}),
    backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Item
      ref={setNodeRef}
      style={itemStyle}
      label={data[index]}
      {...attributes}
      {...listeners}
    />
  );
}

export { Item, SortableItem };
