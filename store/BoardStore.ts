import { ID, database, storage } from "@/appwrite";
import getTodosGroupedByColumns from "@/lib/getTodosGroupedByColumns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
    newTaskInput:string;
    newTaskType:TypedColumn;
    

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo:string,columnId:TypedColumn)=>void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

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
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  addTask:async (todo:string,columnId:TypedColumn)=>{
    const {$id}=await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
      ID.unique(),
      {
        title:todo,
        status:columnId,
      }
    )
    set({newTaskInput:""});
    set((state)=>{
      const newColumns=new Map(state.board.columns);
      const newTodo:Todo={
        $id,
        $createdAt:new Date().toISOString(),
        title:todo,
        status:columnId,
      }
      const column=newColumns.get(columnId);
      if(!column){
        newColumns.set(
          columnId,
          {
            id:columnId,
            todos:[newTodo],
          }
          )
      }else{
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return{
        board:{
          columns:newColumns,
        }
      }
    })
  },

  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    if(todo.image){
        await storage.deleteFile(todo.image.bucketId,todo.image.fileId)
    }

    await database.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
        todo.$id
    )
  },

  
  updateTodoInDb: async (todo, ColumnId) => {
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