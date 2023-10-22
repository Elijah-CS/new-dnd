import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ItemProps {
  id : string,
  opacity?: string
}

export function Item(props: ItemProps) {
  const { id, opacity="1" } = props;

  const style = {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white",
    opacity: opacity
  };

  return <div style={style}>{id}</div>;
}

interface SortableProps {
  id : string
}

export default function SortableItem(props: SortableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const opacity = isDragging ? "0" : "1"

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} opacity={opacity} />
    </div>
  );
}
