import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, brand, price, rating} = similarProductDetails
  return (
    <li className="list-items ">
      <img src={imageUrl} alt={`similar product ${title}`} className="image" />
      <p>{title}</p>
      <p>by {brand}</p>
      <p>Rs {price}/-</p>
      <div className="product-rating-container2">
        <p className="product-rating1 ">{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="star-image1"
        />
      </div>
    </li>
  )
}

export default SimilarProductItem
