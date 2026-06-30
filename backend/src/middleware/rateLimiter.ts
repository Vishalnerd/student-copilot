import {rateLimit} from "express-rate-limit";

 const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: Number(process.env.AUTH_RATE_LIMIT), // Limit each IP to 5 requests per windowMs

  message: {
    message:
      "Too many login attempts. Please try again after 15 minutes.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

 const aiLimiter = rateLimit({

    windowMs:
    60*1000,

    max: Number(process.env.AI_RATE_LIMIT),

    message:{
        message:
        "AI request limit exceeded."
    }

});

const apiLimiter =
    rateLimit({
    windowMs:
    60*1000,

    max: Number(process.env.API_RATE_LIMIT)

    });

export { authLimiter, aiLimiter, apiLimiter };