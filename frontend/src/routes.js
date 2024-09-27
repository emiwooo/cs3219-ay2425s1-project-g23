import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components for better performance
const Questions = lazy(() => import('./pages/Questions'));
const AddQuestion = lazy(() => import('./pages/AddQuestion'));
const Question = lazy(() => import('./pages/Question'));
const EditQuestion = lazy(() => import('./pages/EditQuestion'));
//const NotFound = lazy(() => import('./pages/NotFound')); // Fallback for undefined routes

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Main Questions Page */}
        <Route path="/questions" element={<Questions />} /> {/* Will be displayed under the layout */}
        <Route path="/questions/new" element={<AddQuestion />} /> {/* Add Question route */}
        {/* Detailed Question View */}
        <Route path="/questions/:id" element={<Question />} />
        
        {/* Edit Question View */}
        <Route path="/questions/:id/edit" element={<EditQuestion />} />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;