export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('partner-card-wrapper');

    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        col.classList.add('partner-card-image-wrapper');
      } else {
        col.classList.add('partner-card-content-wrapper', 'description-m');
      }
    });
  });
}