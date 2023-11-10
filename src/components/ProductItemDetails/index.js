import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const convertIntoData = data => ({
  id: data.id,
  imageUrl: data.image_url,
  title: data.title,
  brand: data.brand,
  totalReviews: data.total_reviews,
  rating: data.rating,
  availability: data.availability,
  price: data.price,
  description: data.description,
})

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductDetails: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = convertIntoData(fetchedData)
      const similarProducts = fetchedData.similar_products.map(each =>
        convertIntoData(each),
      )

      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
      this.setState({
        similarProductDetails: similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props

    history.replace('/products')
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => {
        console.log(prevState.count)
        return {count: prevState.count - 1}
      })
    }
  }

  onIncrement = () => {
    this.setState(prevState => {
      console.log(prevState.count)
      return {count: prevState.count + 1}
    })
  }

  renderSimilarProducts = () => {
    const {similarProductDetails} = this.state
    return (
      <u1 className="similar-products-container">
        {similarProductDetails.map(eachProduct => (
          <SimilarProductItem
            similarProductDetails={eachProduct}
            key={eachProduct.id}
          />
        ))}
      </u1>
    )
  }

  renderProductItemDetails = () => {
    const {productDetails, count} = this.state
    return (
      <div>
        <Header />
        <div className="bg-container">
          <div className="products-container">
            <img
              src={productDetails.imageUrl}
              alt="product"
              className="product-image"
            />

            <div className="product-details-container">
              <h1 className="product-title">{productDetails.title}</h1>
              <p className="product-price">Rs {productDetails.price}</p>
              <div className="product-rating-container">
                <p className="product-rating">{productDetails.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star-image"
                />
              </div>
              <p>{productDetails.totalReviews} Reviews</p>

              <p className="product-description">
                {productDetails.description}
              </p>
              <p className="product-availability">
                Available: {productDetails.availability}
              </p>
              <p>Brand: {productDetails.brand}</p>

              <hr />
              <div className="product-count-container">
                <button
                  type="button"
                  className="icons"
                  onClick={this.onDecrement}
                  data-testid="minus"
                >
                  <BsDashSquare />
                </button>
                <p>{count}</p>
                <button
                  type="button"
                  className="icons"
                  onClick={this.onIncrement}
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1>Similar Products</h1>
          {this.renderSimilarProducts()}
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    console.log('failure view')
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
        />
        <p>Product Not Found</p>
        <button type="button" onClick={this.onClickContinueShopping}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="80" width="80" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
