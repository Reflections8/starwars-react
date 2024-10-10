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
    const beamName = "beam-animation-" + (me ? "green" : "red");
    const beam = document.getElementById(beamName) as HTMLElement;

    if (!beam) return;

    const targetRect = targetCell.getBoundingClientRect();

    const startX = window.scrollX;
    const startY = window.scrollY;

    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;
    beam.style.display = "block";
    beam.style.width = "100px";
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
      beam.style.width = "5px";
    }, 10);

    // Remove the beam after the animation completes
    beam.addEventListener("transitionend", () => {
      beam.style.display = "none";
      resolve();
    });
  });
};
