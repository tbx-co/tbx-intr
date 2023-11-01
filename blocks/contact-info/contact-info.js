import { createTag } from "../../scripts/helpers.js";

export default function decorate(block) { 
    const links = block.querySelectorAll('.button');
    links.forEach(link => {
        link.classList = "link"
    });

    [...block.children].forEach((row, index) => { 
        row.classList.add('grid-container');

        [...row.children].forEach((col) => {
            col.classList.add('contact-info-item');
            const heading = col.querySelector('h1,h2,h3,h4,h5,h6');
            if (heading) heading.classList.add('contact-info-title', 'heading-s', 'text-blue');
            const descriptionText = col.querySelectorAll('p');
            const description = createTag('div', {
                class: 'contact-info-description description-m'
            }, '');
            description.replaceChildren(...descriptionText);
            col.append(description)
        });
    });
}