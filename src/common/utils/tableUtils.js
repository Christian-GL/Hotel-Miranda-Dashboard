
export const applyDiscount = (price, discount) => {
    const priceDiscounted = (price * (1 - discount / 100)).toFixed(2)
    return parseFloat(priceDiscounted);
}