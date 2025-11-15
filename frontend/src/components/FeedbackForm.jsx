import React from "react";
import { useForm } from "react-hook-form";

export default function FeedbackForm({ apiUrl, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      rating: 5
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to submit");
        return;
      }

      reset(); // clear form
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="card">
      <h2>Submit Feedback</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <label>Name*</label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Enter your name"
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        {/* EMAIL */}
        <label>Email</label>
        <input
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format"
            }
          })}
          placeholder="Enter email (optional)"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        {/* MESSAGE */}
        <label>Message*</label>
        <textarea
          {...register("message", { required: "Message is required" })}
          rows="4"
          placeholder="Write your feedback"
        />
        {errors.message && <p className="error">{errors.message.message}</p>}

        {/* RATING */}
        <label>Rating</label>
        <select {...register("rating", { required: true })}>
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
