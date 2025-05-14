export const calculateTTC = (HT) => {
    const TVA = HT * 0.2
    return Math.floor((HT + TVA) * 100) / 100;
}