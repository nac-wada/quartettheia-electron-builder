import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { FC, memo } from "react"
import { useDevices } from "../globalContexts/DeviceContext";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";


interface DndContainerProps {
  children: React.ReactNode,
  items: any[]
  // dragStartEvent: any,
  dragEndEvent?: any,
}

const DndContainer: FC<DndContainerProps> = memo(({ children, items, dragEndEvent}) => {
  const { devices, setDevices } = useDevices();
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 10, tolerance: 5 } });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if(!over) return;

    const activeItem = items.find((item) => item.id === active.id);
    const overItem = items.find((item) => item.id === over.id);

    if(!activeItem || !overItem) return;

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if(activeIndex !== overIndex) {
      setDevices(arrayMove(devices, activeIndex, overIndex))
      if(dragEndEvent)  { dragEndEvent(activeIndex, overIndex) }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={devices} strategy={rectSortingStrategy}>
        { children }
      </SortableContext>
    </DndContext>
  )
})

export { DndContainer }