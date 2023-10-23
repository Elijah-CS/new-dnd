import React, {useState, CSSProperties} from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

import Container from './Container';
import {Item} from './SortableItem';

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: "50%"
};

export interface ItemProps {
    [key: string]: string[]
}

interface SortableListFormProps {
  allItems: string[];
}

function SortableListForm({allItems} : SortableListFormProps) {
  const [items, setItems] = useState<ItemProps>({
    options: allItems,
    chosen: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div style={wrapperStyle}>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Container id="options" items={items.options} />
        <Container id="chosen" items={items.chosen} />
        <DragOverlay>{activeId ? <Item isOverlay={true} isDragging={true} id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );

  function findContainer(id: string) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    const {id} = active;

    setActiveId(id.toString());
  }

  function handleDragOver(event: DragOverEvent) {
    const {active, over} = event;

    if (!active || !over) {
      return
    }

    const id = active.id; // id of item being dragged
    const overId: string = over.id.toString(); // id of item OR container being dragged over

    // Find the containers
    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id.toString());
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        // const isBelowLastItem =
        //   over &&
        //   overIndex === overItems.length - 1 &&
        //   draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

        // const modifier = isBelowLastItem ? 1 : 0;

        // newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (!active || !over) {
      return
    }

    const id = active.id;
    const overId: string = over.id.toString();

    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id.toString());
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex,
        ),
      }));
    }

    setActiveId(null);
  }
}

export default SortableListForm;