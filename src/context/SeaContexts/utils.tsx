export const playBeamAnimation = (
  { row, column }: any,
  me: boolean,
  isHit: string,
  blastIt: (isHit: string) => void
) => {
  blastIt(isHit);
  const targetCell = document.getElementById(
    `${me ? "enemy" : "user"}Cell${row}-${column}`
  ) as HTMLElement;
  return new Promise<void>((resolve) => {
    const beam = document.createElement("div");
    beam.className = "beam-animation-" + (me ? "green" : "red");

    document.body.style.overflow = "hidden";
    // Calculate the position of the target cell
    const targetRect = targetCell.getBoundingClientRect();
    const startX = window.scrollX;
    const startY = window.scrollY;
    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;
    document.body.appendChild(beam);
    let targetX = targetRect.left + targetRect.width / 2;
    let targetY = targetRect.top + targetRect.height / 2;
    if (me) {
      targetX -= 1;
      targetY -= 7;
    } else {
      targetX -= 1;
      targetY -= 7;
    }

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    beam.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
      beam.style.left = `${targetX}px`;
      beam.style.top = `${targetY}px`;
      beam.style.width = "10px";
    }, 10);

    // Remove the beam after the animation completes
    beam.addEventListener("transitionend", () => {
      document.body.removeChild(beam);
      document.body.style.overflow = "auto";
      resolve();
    });
  });
};
