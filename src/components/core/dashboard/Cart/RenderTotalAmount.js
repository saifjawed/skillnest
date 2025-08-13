import React from 'react'
import { useSelector } from 'react-redux';
import IconBtn from '../../../common/IconBtn';

const RenderTotalAmount = () => {

    const {total,cart} = useSelector( (state) => state.cart);

    const handlebuycourse = () => {
        const course = cart.map((course) => course._id);
        console.log("Bought these course:",course);

    }
  return (
    <div>

    <p>Total:</p>
    <p>Rs {total}</p>

    <IconBtn
        text="Buy Now"
        onClick={handlebuycourse}
        customClasses={"w-full justify-center"}
    />

    </div>
  )
}

export default RenderTotalAmount;
