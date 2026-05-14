export function validateEmail(value) {
  if (!value) return "El correo electrónico es obligatorio";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Correo electrónico inválido";
  return null;
}

export function validatePassword(value) {
  if (!value) return "La contraseña es obligatoria";
  if (value.length < 6) return "Mínimo 6 caracteres";
  if (value.length > 50) return "Máximo 50 caracteres";
  return null;
}

export function validateUsername(value) {
  if (!value) return "El nombre de usuario es obligatorio";
  if (value.trim().length < 6) return "Mínimo 6 caracteres";
  if (value.trim().length > 50) return "Máximo 50 caracteres";
  return null;
}

export function validateTitle(value) {
  if (!value) return "El título es obligatorio";
  if (value.trim().length < 3) return "Mínimo 3 caracteres";
  if (value.trim().length > 50) return "Máximo 50 caracteres";
  return null;
}

export function validateDescription(value) {
  if (!value) return null;
  if (value.trim().length < 3) return "Mínimo 3 caracteres";
  if (value.trim().length > 500) return "Máximo 500 caracteres";
  return null;
}

export function validateDueDate(value) {
  if (!value) return "La fecha límite es obligatoria";
  return null;
}
