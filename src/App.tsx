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
};

interface ItemProps {
    [key: string]: string[]
}

function App() {
  const [items, setItems] = useState<ItemProps>({
    list1: ["A1","A2","A3","A4","A5","A6","A7",],
    list2: [],
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
        <Container id="list1" items={items.list1} />
        <Container id="list2" items={items.list2} />
        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
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

    const id = active.id;
    const overId: string = over.id.toString();

    // Find the containers
    const activeContainer = findContainer(id.toString());
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
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

export default App;