"use client";

import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useEffect } from "react";
import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";

interface BoardProps {
  userId: string | null;
}
const Board = ({ userId }: BoardProps) => {
  const [board, getBoard, setBoardState, updateTodoInDb, setUserId] =
    useBoardStore((state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDb,
      state.setUserId,
    ]);

  useEffect(() => {
    getBoard(userId);

    setUserId(userId);
  }, [getBoard, userId, setUserId]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    //handle outside
    if (!destination) return;
    //handle column
    else if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    //handle todo in nest
    else {
      const columns = Array.from(board.columns);
      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];

      const startCol: Column = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finishCol: Column = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };
      if (!startCol || !finishCol) return;
      if (source.index === destination.index && startCol === finishCol) return;

      const newTodos = startCol.todos;
      const [todoMoved] = newTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        //     //same column
        newTodos.splice(destination.index, 0, todoMoved);
        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newCol);
        setBoardState({ ...board, columns: newColumns });
      } else {
        //diff column
        const finishedTodos = Array.from(finishCol.todos);
        finishedTodos.splice(destination.index, 0, todoMoved);

        const newColumns = new Map(board.columns);
        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        newColumns.set(startCol.id, newCol);
        newColumns.set(finishCol.id, {
          id: finishCol.id,
          todos: finishedTodos,
        });

        //update in db
        updateTodoInDb(userId, todoMoved, finishCol.id);
        setBoardState({ ...board, columns: newColumns });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column
                userId={userId}
                key={id}
                id={id}
                todos={column.todos}
                index={index}
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
