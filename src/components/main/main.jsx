/*
    Main, получив данные из QuerySelect, рендерит слайдер, применяя функционал 
    библеотеки Flickity, и витрину с товарами, используя информацию из пропсов. 
    Также в компоненте Main прописана логика, помимо стандартной логики, 
    обеспеченной Flickity, работы слайдера: центровка текущей (той, которая 
    находится в поле видимости пользователя) категории при скролле страницы, 
    плавный переход по якорям.

    При рендеринге витрины с товарами компоненту ProductItem передаюся данные 
    о товарах для создания карточки товара
*/

import React, { useEffect, useRef } from 'react';
import Flickity from 'flickity';
import ProductItem from '../productItem/productItem.jsx';
import './main.css';

const tg = window.Telegram.WebApp;

function activeCategory(target) {
    let w = window;
    let t = document.getElementById(target);
    let wt = w.scrollY;
    let wh = w.innerHeight - tg.viewportHeight / 2;
    let eh = t.offsetHeight;
    let et = t.offsetTop;
    if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
        return true;
    } else {
        return false;
    }
}

const Main = ({data_1, data_2}) => {
    useEffect(() => {
        let flkty;

        flkty = new Flickity('.sliderCategory', {
            freeScroll: true,
            contain: true,
            cellAlign: 'center',
            dragThreshold: 10,
            prevNextButtons: false,
            pageDots: false,
        });

        function handleScroll() {
            const categoryCells = document.querySelectorAll('[id^="categoryCell_"]');
            categoryCells.forEach((cell, i) => {
                if (activeCategory(cell.id)) {
                    if (flkty.selectedIndex !== i) {
                        const links = document.querySelectorAll('.sliderCategory a');
                        links.forEach(link => {
                            link.classList.remove('active');
                        });
                        document.querySelector('.sliderCategory  a[href="#' + cell.id + '"]').classList.add('active');
                        flkty.select(i);
                    }
                }
            });
        }
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [data_1]);

    const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const hash = e.target.getAttribute('href');
		const targetElement = document.getElementById(hash.substring(1));
		if (targetElement) {
			const offsetTop = targetElement.offsetTop - 60;
			window.scroll({
				top: offsetTop,
				behavior: 'smooth'
			});
		}
	}
    
    return (
        <>
            <div className="header">
                <div className="sliderCategory">
                    {data_1.map((item, idx) => {
                        return (
                            <a 
                                key={idx}
                                href={`#categoryCell_${idx}`} 
                                className={`categoryName${idx === 0 ? ' active' : ''}`}
                                onClick={handleClick}
                            >
                                {item["Лого категории"]} {item["Название категории"]}
                            </a>
                        );
                    })}
                </div>
            </div>

            <div className='productlList'>
                {data_1.map((category, idx) => (
                    <div key={category['ID категории']} id={`categoryCell_${category['ID категории']}`}>
                        <h2 style={{marginLeft: '10px'}}>
                            {category['Лого категории']} {category['Название категории']}
                        </h2>
                        <div className='list'>
                            {data_2.map((product) => {
                                return (
                                    category['ID категории'] === product['ID категории'] && (
                                        <ProductItem
                                            key={product["ID товара"]}
                                            product={product}
                                        />
                                    )
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Main;