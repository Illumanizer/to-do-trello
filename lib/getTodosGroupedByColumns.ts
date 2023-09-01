/* eslint-disable react-hooks/rules-of-hooks */
import { database } from "@/appwrite"
import { Query } from "appwrite";

interface getTodosGroupedByColumnsprops {
    userId: string | null
}

const getTodosGroupedByColumns = async ({
    userId
}: getTodosGroupedByColumnsprops) => {
    
   
    const data=await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODO_COLLECTION_ID!,
        [
           Query.equal("uid",userId!),
            Query.orderDesc("$createdAt")
        ]
    );
    
    const todos=data.documents;


    const columns=todos.reduce((acc,todo)=>{
        if(!acc.get(todo.status)){
            acc.set(todo.status,{
                id:todo.status,
                todos:[]
            })
        }
        acc.get(todo.status)!.todos.push({
            $id:todo.$id,
            $createdAt:todo.$createdAt,
            uid:todo.uid,
            title:todo.title,
            status:todo.status,
            ...(todo.image && {image:JSON.parse(todo.image)})
        })
        return acc;
    },new Map<TypedColumn,Column>)

    const columnTypes: TypedColumn[]=["todo","inprogress","done"]
    for(const columnType of columnTypes){
        if(!columns.get(columnType)){
            columns.set(columnType,{
                id:columnType,
                todos:[],
            })
        }
    }
    const sortedColumns=new Map(
        Array.from(columns.entries()).sort((a,b)=>(
            columnTypes.indexOf(a[0])-columnTypes.indexOf(b[0])
        ))
    );

    const board:Board={
        columns: sortedColumns
    }
    return board
}

export default getTodosGroupedByColumns