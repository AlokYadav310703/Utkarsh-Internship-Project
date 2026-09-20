export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  void _next;
  if (error?.issues?.length) {
    const details = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).json({
      message: details.map((issue) => `${issue.path || "field"}: ${issue.message}`).join("; "),
      details,
    });
    return;
  }

  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Internal server error",
    details: error.details || undefined,
  });
};
