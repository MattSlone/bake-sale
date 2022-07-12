import React, { useState } from 'react';
import AddCustomProductContainer from '../containers/AddCustomProductContainer'
import AddRegularProductContainer from '../containers/AddRegularProductContainer'
import { useParams} from "react-router-dom";

export default function AddProduct(props) {
  let { id } = useParams()
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))

  return (
    product?.custom ? <AddCustomProductContainer />
    : <AddRegularProductContainer />
  );
}
