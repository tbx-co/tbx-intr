import { createTag } from '../../scripts/helpers.js';

export default function decorate(block) { 
    [...block.children].forEach((row, index) => { 
        row.classList.add('location-item');

        [...row.children].forEach((col, i) => { 
            const images = col.querySelectorAll('picture');
            if (images.length > 0) {
                col.classList.add('image-wrapper');
                col.innerHTML = ""
                images.forEach((image, index) => {
                    if (index == 0) { image.classList.add('main-image') }
                    if (index == 1) { image.classList.add('hover-active')}
                    col.append(image);
                });

            } else {
                col.classList.add('content-wrapper'); 

                const titleIndex = createTag('span', {
                    class: 'title-index',
                }, `0${index+1}.`);
                const title = col.querySelector('h1,h2,h3,h4,h5,h6');
                title.classList.add('heading-m', 'heading')
                title.prepend(titleIndex)
                const titleWrapper = createTag('div', {
                    class: 'title-wrapper '
                }, title);
                

                const descriptionText = col.querySelectorAll('p');
                const description = createTag('div', {
                    class: 'description-wrapper description-m'
                }, '');
                description.replaceChildren(...descriptionText);
                col.append(titleWrapper, description);
            }
        })
    })
}