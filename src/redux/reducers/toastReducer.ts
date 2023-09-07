import { createAction, createReducer } from "@reduxjs/toolkit";

export const setToast = createAction<ToastReducer>("app/toast");

export const emptyToast: ToastReducer = {
  show: false,
  title: "",
  message: "",
  type: "info",
  square: false,
};

const toastReducer = createReducer(emptyToast, (builder) =>
  builder.addCase(setToast, (state, action) => {
    return {
      ...state,
      show: action.payload.show,
      title: action.payload.title,
      message: action.payload.message || "err:toast:empty-message",
      type: action.payload.type,
    };
  }),
);

import Joi from "joi";

export interface ToastReducer {
  show: boolean;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  square?: boolean;
}

const schema = Joi.object<ToastReducer>({
  show: Joi.boolean().default(false).required(),
  title: Joi.string().default("").required(),
  message: Joi.string().default("").required(),
  type: Joi.string().valid("success", "warning", "error", "info").default("success").required(),
  square: Joi.boolean().default(false).optional(),
});

export const toastTypeValidate = (data: ToastReducer) => schema.validate(data);

export default toastReducer;
