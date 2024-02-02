import React from 'react';
import './productItem.css';
import Button from './../button/button.jsx';

const ProductItem = ({ product }) => {
    
    return (
        <>
            <div className='cardProduct' id={product["ID товара"]} >
                <picture><img src={`data:image/jpeg;base64,${product["Превью"]}`} alt=''/></picture>
                <h3 id='nameProduct'>
                    {product["Название"]}
                </h3>
                <p id='descriptionProduct'>
                    {product["Описание"]}
                </p>
                <Button price={product["Стоимость"]}/>

            </div>
        </>
    );
}

export default ProductItem;