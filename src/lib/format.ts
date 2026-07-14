export function formatPrice(price: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currencyCode} ${price.toLocaleString()}`;
  }
}

export function formatMileage(mileage: number) {
  return `${mileage.toLocaleString()} km`;
}
