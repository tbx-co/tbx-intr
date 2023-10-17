export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('row-wrapper');
    [...row.children].forEach((div) => {
      div.classList.add('text-wrapper', 'description-m');
    });
  });
}
