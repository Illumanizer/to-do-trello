import { ID, database, storage } from "@/appwrite";
import getTodosGroupedByColumns from "@/lib/getTodosGroupedByColumns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: (userId: string | null) => void;
  setBoardState: (board: Board) => void;
  updateTodoInDb: (userId: String | null ,todo: Todo, columnId: TypedColumn) => void;
  newTaskInput:string;
  newTaskType:TypedColumn;
  searchString: string;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setSearchString: (searchString: string) => void;
  addTask : ( userId: string | null ,todo: string , columnId: TypedColumn)=>void;
  deleteTask: (userId:  string | null ,taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  setNewTaskInput: (input:string)=>void;
  setNewTaskType: (columnId: TypedColumn)=>void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  newTaskInput:"",
  newTaskType:"todo",
  userId: null,
  setSearchString: (searchString) => set({ searchString }),
  setUserId: (userId) => set({ userId }),
  getBoard: async (userId) => {
    const board = await getTodosGroupedByColumns({userId});
    set({ board });
  },
  setBoardState: (board) => set({ board }),


  deleteTask: async (userId,taskIndex, todo, id) => { 
    
    if (todo.uid !== userId) {
      return;
    }
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

        await database.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
        todo.$id
    )
  },

  addTask: async (userId: string | null,todo: string , columnId: TypedColumn) => {
  
    const {$id} = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
     ID.unique(),
      {
        uid: userId,
        title: todo,
        status: columnId,
      }
    );
    set({newTaskInput:""});
    set({newTaskType:"todo"});
    set((state)=> {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        uid: userId,
        title: todo,
        status: columnId,
      };
      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
        id: columnId,
        todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
   
      return { board: { columns: newColumns } };

    })

  },
  updateTodoInDb: async (userId,todo, ColumnId) => {


  
    if (todo.uid !== userId) {

      return;
    }
    
    await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: ColumnId,
      }
    );
  },
  setNewTaskInput:(input:string) => set({newTaskInput:input}),  
  setNewTaskType:(columnId:TypedColumn) => set({newTaskType:columnId}),  
}));
