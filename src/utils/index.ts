export function openMenu() {
  console.log("MENU OPENED");
}

export function formatNumberWithCommas(number?: number) {
  if (number) {
    const strNumber = number.toString();
    const parts = strNumber.split(".");
    let integerPart = parts[0];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length === 2) {
      return integerPart + "." + parts[1];
    } else {
      return integerPart;
    }
  }
}
