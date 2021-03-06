import { DragItem } from "../types/DragItem"
import { BoardInterface } from "./boardInterface";
import { Board } from "../models";

export interface AppState {
  cachedReset: BoardInterface 
  board: BoardInterface
  draggedItem?: DragItem
  sessionId?: string
}

export interface Session {
  boards: Board[]
}