import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis
} from "@dnd-kit/modifiers";
import { Item, SortableItem } from "./Item";
import styles from "./styles.css";

function App() {
  const [items, setItems] = useState(
    [...Array(20).keys()].map((index) => `Item ${index}`)
  );
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <div
      tabIndex={0}
      style={{
        border: "1px solid black",
        width: "200px",
        height: "200px",
        overflow: "auto"
      }}
      onKeyDown={() => console.log("keydown")}
    >
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id, index) => (
            <SortableItem key={items[index]} index={index} data={items} />
          ))}
        </SortableContext>
        <DragOverlay>
          <Item label="Drag Overlay" />
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export default App;
