
// Por precisión matemática redondear el resultado a posteriori
export const applyDiscount = (price: number, discount: number): number => {
    return price * (1 - discount / 100)
}
