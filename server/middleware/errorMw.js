//Resource Not Found Error
const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error("The Resource/URL Not Found!");
  next(error);
};
// Error Handling Middleware
const errorHandle = (error, req, res, next) => {
  let errorMessage = error.message;
  let errorCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (error.name === "CastError" && error.kind === "ObjectId") {
    errorMessage = "MongoDB Error! Invalid ObjectId!";
    errorCode = 404;
  }
  res.status(errorCode).send({
    status: "Failed! Error Found In The Server!",
    code: errorCode,
    message: errorMessage,
  });
  console.error(error);
};
export { notFound, errorHandle };
