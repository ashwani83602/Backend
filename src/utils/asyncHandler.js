export { asyncHandler };

const asyncHandler = (reqestHandler) => {
  (req, res, next) => {
    Promise.resolve(reqestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
// const asyncHandle = () => {};
// const asyncHandle = (function) => ()=>{}
// const asyncHandle = (function) => async ()=>{}

// const asyncHandler = (fun) => async (req, res, next) => {
//   try {
//     await fun(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
