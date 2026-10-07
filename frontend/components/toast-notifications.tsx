"use client";

import { ToastContainer } from "react-toastify";

export function ToastNotifications() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={4}
    />
  );
}
