import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function FeedbackForm({ apiUrl, onSuccess }) {
  const [selectedRating, setSelectedRating] = useState(5);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      rating: 5
    }
  });

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const showNotif = (type) => {
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const onSubmit = async (data) => {
    try {
      // Ensure rating is a number
      const submitData = {
        ...data,
        rating: Number(data.rating) || 5
      };
      
      console.log('Submitting feedback to:', `${apiUrl}/api/feedback`);
      console.log('Data:', submitData);
      console.log('Form validation errors:', errors);
      
      const res = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', res.status);
      
      // Try to parse JSON, but handle non-JSON responses
      let json;
      const text = await res.text();
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response as JSON:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        console.error('Error response:', json);
        const errorMsg = json.error || `Failed to submit: ${res.status} ${res.statusText}`;
        alert(`Error: ${errorMsg}\n\nAPI URL: ${apiUrl}\n\nCheck browser console for details.`);
        showNotif('error');
        return;
      }

      reset();
      setSelectedRating(5);
      setValue('rating', 5);
      showNotif('success');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Network or other error:', err);
      const errorMsg = err.message || 'Network error. Please check if the backend is running and accessible.';
      alert(`Error: ${errorMsg}\n\nAPI URL: ${apiUrl}\n\nCheck browser console for details.`);
      showNotif('error');
    }
  };

  return (
    <>
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <span>{notificationType === 'success' ? '✓' : '✕'}</span>
          <span>{notificationType === 'success' ? 'Feedback submitted successfully!' : 'Failed to submit feedback. Please try again.'}</span>
        </div>
      )}
      
      <div className="card">
        <h2>Submit Feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* NAME */}
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="error">
              <span>⚠</span>
              {errors.name.message}
            </p>
          )}

          {/* EMAIL */}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format"
              }
            })}
            placeholder="Enter email (optional)"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="error">
              <span>⚠</span>
              {errors.email.message}
            </p>
          )}

          {/* RATING */}
          <label>Rating *</label>
          <div className="rating-input">
            <div className="star-selector">
              {[5, 4, 3, 2, 1].map((rating) => (
                <React.Fragment key={rating}>
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    value={rating}
                    {...register("rating", { 
                      required: true,
                      valueAsNumber: true
                    })}
                    onChange={() => handleRatingChange(rating)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={`rating-${rating}`}>★</label>
                </React.Fragment>
              ))}
            </div>
            <span style={{ color: 'var(--muted-light)', fontSize: '0.875rem' }}>
              {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
            </span>
          </div>

          {/* MESSAGE */}
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            {...register("message", { required: "Message is required" })}
            rows="5"
            placeholder="Write your feedback here..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="error">
              <span>⚠</span>
              {errors.message.message}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="success">
            {isSubmitting ? (
              <>
                <span className="loading"></span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
