export function validateLogin(usuario, contrasena) {
  const errors = {};

  if (!usuario || !usuario.trim()) {
    errors.usuario = 'El usuario es obligatorio.';
  } else if (usuario.trim().length < 3) {
    errors.usuario = 'El usuario debe tener al menos 3 caracteres.';
  }

  if (!contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.';
  } else if (contrasena.length < 4) {
    errors.contrasena = 'La contraseña debe tener al menos 4 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const ALLOWED_EXTENSIONS = ['csv', 'xlsx', 'xls'];

export function validateUploadedFile(file) {
  if (!file) {
    return { valid: false, message: 'No se seleccionó ningún archivo.' };
  }

  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      message: 'Formato no soportado. Usa un archivo .csv, .xlsx o .xls.',
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
    return { valid: false, message: 'El archivo supera el tamaño máximo permitido (10MB).' };
  }

  return { valid: true, ext };
}

/**
 * Valida que las filas parseadas de un archivo tengan al menos
 * una columna identificable como "especialidad" o "nombre" y
 * algún valor numérico. No lanza excepción: retorna un resultado
 * para que la UI nunca se rompa por un archivo mal formado.
 */
export function validateParsedRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { valid: false, message: 'El archivo no contiene filas de datos.' };
  }

  const firstRow = rows[0];
  const keys = Object.keys(firstRow || {}).map((k) => k.toLowerCase());
  const hasLabelColumn = keys.some((k) =>
    ['especialidad', 'nombre', 'servicio', 'categoria', 'categoría'].includes(k)
  );

  if (!hasLabelColumn) {
    return {
      valid: false,
      message:
        'No se encontró una columna de nombre/especialidad reconocible. Verifica los encabezados del archivo.',
    };
  }

  return { valid: true };
}
