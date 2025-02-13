
export const applyDiscount = (price: number, discount: number) => {
    const priceDiscounted = (price * (1 - discount / 100)).toFixed(2)
    return parseFloat(priceDiscounted);
}