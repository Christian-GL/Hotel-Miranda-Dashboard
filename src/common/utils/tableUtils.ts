
// Por precisión matemática redondear el resultado a posteriori.
export const applyDiscount = (price: number, discount: number): number => {
    return price * (1 - discount / 100)
}

// Aplica formato con 2 decimales al precio final para mostrar por ventana.
export const formatPrice = (value: number): string => {
    return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2)
}