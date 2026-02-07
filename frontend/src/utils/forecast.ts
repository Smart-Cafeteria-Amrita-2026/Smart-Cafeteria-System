export const getForecastStatus = (maxQty: number, orderedQty: number) => {
    const remaining = maxQty - orderedQty;
    const ratio = remaining / maxQty;

    if (ratio > 0.3)
        return { label: "Available", color: "green", disabled: false };

    if (ratio > 0.15)
        return { label: "Limited", color: "yellow", disabled: false };

    if (ratio > 0.05)
        return { label: "Selling Fast", color: "red", disabled: false };

    return { label: "Sold Out", color: "gray", disabled: true };
};
