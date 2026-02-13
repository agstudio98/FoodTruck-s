import React, { useState } from 'react';

const ReviewForm = ({ productId, onSubmit, loading }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    onSubmit({
      product: productId,
      rating: parseInt(rating),
      title: title || `${rating} de 5 estrellas`,
      comment: comment.trim()
    });

    // Limpiar formulario
    setRating(5);
    setTitle('');
    setComment('');
  };

  const renderStarInput = (value) => {
    return (
      <div className="star-input">
        {[...Array(5)].map((_, i) => (
          <label key={i} className={`star-label ${i < value ? 'filled' : ''}`}>
            <input
              type="radio"
              name="rating"
              value={i + 1}
              checked={rating === i + 1}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={{ display: 'none' }}
            />
            ★
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="review-form-container">
      <h3>Deja tu reseña</h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Calificación</label>
          {renderStarInput(rating)}
          <p className="rating-label">{rating} de 5 estrellas</p>
        </div>

        <div className="form-group">
          <label htmlFor="title">Título (opcional)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Excelente producto, altamente recomendado"
            maxLength={100}
            className="form-input"
          />
          <p className="char-count">{title.length}/100</p>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Tu reseña</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            maxLength={500}
            rows={4}
            className="form-textarea"
          />
          <p className="char-count">{comment.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-submit"
        >
          {loading ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
