
// promise
const  asyncHandler =(requestHandler:any)=>{
  return  (req:any,res:any,next:any)=>{
             Promise.resolve(requestHandler(req,res,next)).catch((error)=> next(error))
    }
}

export {asyncHandler};

// const asyncHandler =()=>{}
// const asyncHandler =(func)=> () =>{}
// const asyncHandler =(func)=>async () =>{}

// using try catch
// const asyncHandler =(fn:any)=> async (req:any ,res :any, next:any) =>{ 
//     try {
//         await fn(req,res,next);
//     } catch (error:any) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

// export {asyncHandler};
// 
