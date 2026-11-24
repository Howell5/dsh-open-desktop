/**
 * 拖拽层适配器。
 *
 * 正式运行时用 dnd-kit；极简 React（测试用的函数桩）里没有 context/reducer，
 * 这时退化成"只渲染 children"的空实现，保证不引入浏览器依赖也能装载模块。
 */
import React from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { snapCenterToCursor } from '@dnd-kit/modifiers'

const supported = typeof React.version === 'string'
  && typeof React.createContext === 'function'
  && typeof React.useReducer === 'function'

function Passthrough(props) {
  return props.children === undefined ? null : props.children
}

function inertSortable() {
  return {
    setNodeRef: function () {},
    setActivatorNodeRef: function () {},
    attributes: {},
    listeners: {},
    isDragging: false,
  }
}

export const dnd = supported
  ? {
      supported: true,
      DndContext: DndContext,
      DragOverlay: DragOverlay,
      SortableContext: SortableContext,
      useSortable: useSortable,
      useSensor: useSensor,
      useSensors: useSensors,
      MouseSensor: MouseSensor,
      TouchSensor: TouchSensor,
      KeyboardSensor: KeyboardSensor,
      closestCenter: closestCenter,
      rectSortingStrategy: rectSortingStrategy,
      sortableKeyboardCoordinates: sortableKeyboardCoordinates,
      snapCenterToCursor: snapCenterToCursor,
    }
  : {
      supported: false,
      DndContext: Passthrough,
      DragOverlay: function () { return null },
      SortableContext: Passthrough,
      useSortable: inertSortable,
      useSensor: function () { return null },
      useSensors: function () { return [] },
      MouseSensor: null,
      TouchSensor: null,
      KeyboardSensor: null,
      closestCenter: null,
      rectSortingStrategy: undefined,
      sortableKeyboardCoordinates: null,
      snapCenterToCursor: null,
    }
