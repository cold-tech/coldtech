import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Agenda from "../pages/Agenda";
import HomePage from "../components/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}