
type Categories = {
    color:string,
    text:string
}
type CategoriesSetter = Record<string,(value:number)=>Categories>
export const getCategories:CategoriesSetter = {
    lux:(value:number)=>{
        return {
            color:"",
            text:""
        }
    },
    temperature:(t:number)=>{
       return {
            color:"",
            text:""
        }
    },
    dust:(d:number)=>{
         return {
            color:"",
            text:""
        }
    }

}